from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Carrito, ItemCarrito, Orden, ItemOrden
from productos.models import Producto, StockTienda
from .serializers import ItemCarritoSerializer, CarritoSerializer
from .mercadopago_service import MercadoPagoService
import logging
from django.db import transaction
from django.shortcuts import get_object_or_404
from usuarios.models import CustomerUser
import time

logger = logging.getLogger(__name__)

class CarritoViewSet(viewsets.GenericViewSet):
    # Inicializamos el servicio de MercadoPago
    mercadopago_service = MercadoPagoService()
    
    def _get_cart(self, user, guest_cart_id=None):
        """Helper para obtener el carrito del usuario o invitado"""
        if user.is_authenticated:
            return Carrito.objects.filter(usuario=user).first()
        elif guest_cart_id:
            return Carrito.objects.filter(id=guest_cart_id, usuario__isnull=True).first()
        return None

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        producto_id = request.data.get('producto_id')
        cantidad = int(request.data.get('cantidad', 1))
        guest_cart_id = request.data.get('guest_cart_id')
        user = request.user

        if user.is_authenticated:
            carrito, _ = Carrito.objects.get_or_create(usuario=user)
        else:
            if guest_cart_id:
                carrito, _ = Carrito.objects.get_or_create(id=guest_cart_id, usuario=None)
            else:
                carrito = Carrito.objects.create(usuario=None)

        try:
            producto = Producto.objects.get(id=producto_id)
            item, created = ItemCarrito.objects.get_or_create(
                carrito=carrito,
                producto=producto,
                defaults={'cantidad': cantidad}
            )
            if not created:
                item.cantidad += cantidad
                item.save()
            data = ItemCarritoSerializer(item).data
            if not user.is_authenticated and created:
                data['guest_cart_id'] = carrito.id
            return Response(data, status=status.HTTP_200_OK)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        item_id = request.data.get('item_id')
        guest_cart_id = request.data.get('guest_cart_id')
        user = request.user

        logger.info(f"remove_item - item_id: {item_id}, guest_cart_id: {guest_cart_id}, user_authenticated: {user.is_authenticated}")

        try:
            # Obtener el item del carrito
            item = ItemCarrito.objects.get(id=item_id)
            
            logger.info(f"Item encontrado - carrito_id: {item.carrito.id}, carrito_usuario: {item.carrito.usuario}")
            
            # Verificar que el usuario tenga permiso para eliminar el item
            if user.is_authenticated:
                if item.carrito.usuario != user:
                    logger.warning(f"Usuario autenticado no coincide - item.carrito.usuario: {item.carrito.usuario}, request.user: {user}")
                    return Response({'error': 'No tienes permiso para eliminar este item'}, status=status.HTTP_403_FORBIDDEN)
            else:
                logger.info(f"Comparando carrito IDs - item.carrito.id: {item.carrito.id} (type: {type(item.carrito.id)}), guest_cart_id: {guest_cart_id} (type: {type(guest_cart_id)})")
                if str(item.carrito.id) != guest_cart_id:
                    logger.warning(f"Guest cart ID no coincide - item.carrito.id: {item.carrito.id}, guest_cart_id: {guest_cart_id}")
                    return Response({'error': 'No tienes permiso para eliminar este item'}, status=status.HTTP_403_FORBIDDEN)

            # Eliminar el item
            item.delete()
            logger.info(f"Item {item_id} eliminado exitosamente")
            
            return Response({'message': 'Item eliminado exitosamente'}, status=status.HTTP_200_OK)
            
        except ItemCarrito.DoesNotExist:
            logger.error(f"Item {item_id} no encontrado")
            return Response({'error': 'Item no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error al eliminar item: {e}")
            return Response({'error': 'Error al eliminar el item'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def get_cart(self, request):
        guest_cart_id = request.query_params.get('guest_cart_id')
        user = request.user
        carrito = None
        if user.is_authenticated:
            carrito = Carrito.objects.filter(usuario=user).first()
        elif guest_cart_id:
            carrito = Carrito.objects.filter(id=guest_cart_id, usuario__isnull=True).first()
        if carrito:
            return Response(CarritoSerializer(carrito).data)
        return Response({'items': [], 'total': 0})

    @action(detail=False, methods=['post'])
    def create_mercadopago_preference(self, request):
        guest_cart_id = request.data.get('guest_cart_id')
        user = request.user
        carrito = self._get_cart(user, guest_cart_id)
        
        if not carrito or not carrito.items.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear metadata para asociar el pago con el carrito y el usuario
        metadata = {
            "cart_id": str(carrito.id),
        }
        if user.is_authenticated:
            metadata["user_id"] = user.id

        # Convertir items del carrito al formato que espera MercadoPago
        items_mp = [{
            "title": item.producto.nombre,
            "quantity": item.cantidad,
            "unit_price": float(item.producto.precio),
            "currency_id": "CLP"
        } for item in carrito.items.all()]
        
        # Usar el servicio para crear la preferencia, pasando la metadata
        preference = self.mercadopago_service.create_preference(items_mp, metadata)
        
        if not preference:
            return Response(
                {'error': 'Error en la respuesta de Mercado Pago'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        return Response(preference, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def webhook(self, request):
        """
        Webhook para procesar notificaciones de MercadoPago.
        Crea la orden, vacía el carrito y actualiza el stock si el pago es aprobado.
        """
        logger.info(f"Webhook de MercadoPago recibido: {request.data}")
        
        topic = request.data.get("topic")
        if topic != "payment":
            return Response(status=status.HTTP_204_NO_CONTENT)

        payment_id = request.data.get("data", {}).get("id")
        if not payment_id:
            logger.warning("Webhook no contiene ID de pago.")
            return Response({"status": "ignored", "reason": "no payment id"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            payment_info = self.mercadopago_service.get_payment_info(payment_id)
            if not payment_info:
                logger.error(f"No se pudo obtener información para el pago ID: {payment_id}")
                return Response({"status": "error"}, status=status.HTTP_404_NOT_FOUND)

            logger.info(f"Información del pago obtenida: {payment_info.get('status')}")

            if payment_info.get("status") == "approved":
                metadata = payment_info.get("metadata", {})
                cart_id = metadata.get("cart_id")
                user_id = metadata.get("user_id")

                if not cart_id:
                    logger.error("Webhook no contiene 'cart_id' en metadata.")
                    return Response({"status": "error", "reason": "missing cart_id"}, status=status.HTTP_400_BAD_REQUEST)

                carrito = get_object_or_404(Carrito, id=cart_id)
                if not carrito.items.exists():
                    logger.warning(f"El carrito {cart_id} ya estaba vacío al procesar el webhook.")
                    return Response({"status": "ok", "reason": "cart already empty"}, status=status.HTTP_200_OK)

                # Crear la orden
                orden = Orden.objects.create(
                    usuario_id=user_id,
                    total=sum(item.subtotal for item in carrito.items.all()),
                    estado='pagado',
                    payment_id=payment_id,
                    # Asumiendo que la info del comprador viene en el pago
                    nombre=payment_info.get("payer", {}).get("first_name", "N/A"),
                    email=payment_info.get("payer", {}).get("email", "N/A"),
                    telefono=payment_info.get("payer", {}).get("phone", {}).get("number", "N/A"),
                    # La info de envío debería recolectarse antes
                    direccion="Dirección de prueba",
                    ciudad="Ciudad de prueba",
                    codigo_postal="12345",
                    metodo_pago="mercadopago"
                )

                # Mover items del carrito a la orden y actualizar stock
                for item_carrito in carrito.items.all():
                    ItemOrden.objects.create(
                        orden=orden,
                        producto=item_carrito.producto,
                        cantidad=item_carrito.cantidad,
                        precio_unitario=item_carrito.producto.precio
                    )
                    
                    # Actualizar stock del producto en todas las tiendas
                    stocks_tienda = StockTienda.objects.filter(producto=item_carrito.producto)
                    
                    if stocks_tienda.exists():
                        # Si hay stock en tiendas, reducir de la primera tienda disponible
                        for stock in stocks_tienda:
                            if stock.cantidad >= item_carrito.cantidad:
                                stock.cantidad -= item_carrito.cantidad
                                stock.save()
                                logger.info(f"Stock actualizado en tienda {stock.tienda.nombre}: {stock.cantidad}")
                                break
                        else:
                            # Si no hay suficiente stock en ninguna tienda, registrar el error
                            logger.error(f"Stock insuficiente para {item_carrito.producto.nombre} al procesar orden {orden.id}")
                    else:
                        logger.warning(f"No hay stock registrado para {item_carrito.producto.nombre} en ninguna tienda")
                
                # Vaciar el carrito
                carrito.items.all().delete()
                logger.info(f"Orden {orden.id} creada y carrito {cart_id} vaciado.")

            return Response({"status": "ok"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error procesando webhook de MercadoPago: {e}")
            return Response({"status": "error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def simulate_payment(self, request):
        """
        Endpoint para simular un pago exitoso.
        Crea la orden, vacía el carrito y actualiza el stock.
        """
        guest_cart_id = request.data.get('guest_cart_id')
        user = request.user
        carrito = self._get_cart(user, guest_cart_id)
        
        if not carrito or not carrito.items.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Obtener datos del formulario
            shipping_data = {
                'nombre': request.data.get('nombre', 'Cliente Simulado'),
                'email': request.data.get('email', 'cliente@simulado.com'),
                'telefono': request.data.get('telefono', '+56912345678'),
                'direccion': request.data.get('direccion', 'Dirección Simulada'),
                'ciudad': request.data.get('ciudad', 'Ciudad Simulada'),
                'codigo_postal': request.data.get('codigo_postal', '12345'),
            }

            # Crear la orden
            orden = Orden.objects.create(
                usuario_id=user.id if user.is_authenticated else None,
                total=sum(item.subtotal for item in carrito.items.all()),
                estado='pagado',
                payment_id=f"SIM-{carrito.id}-{int(time.time())}",
                nombre=shipping_data['nombre'],
                email=shipping_data['email'],
                telefono=shipping_data['telefono'],
                direccion=shipping_data['direccion'],
                ciudad=shipping_data['ciudad'],
                codigo_postal=shipping_data['codigo_postal'],
                metodo_pago="pago_simulado"
            )

            # Mover items del carrito a la orden y actualizar stock
            for item_carrito in carrito.items.all():
                ItemOrden.objects.create(
                    orden=orden,
                    producto=item_carrito.producto,
                    cantidad=item_carrito.cantidad,
                    precio_unitario=item_carrito.producto.precio
                )
                
                # Actualizar stock del producto en todas las tiendas
                stocks_tienda = StockTienda.objects.filter(producto=item_carrito.producto)
                
                if stocks_tienda.exists():
                    # Si hay stock en tiendas, reducir de la primera tienda disponible
                    for stock in stocks_tienda:
                        if stock.cantidad >= item_carrito.cantidad:
                            stock.cantidad -= item_carrito.cantidad
                            stock.save()
                            logger.info(f"Stock actualizado en tienda {stock.tienda.nombre}: {stock.cantidad}")
                            break
                    else:
                        # Si no hay suficiente stock en ninguna tienda, registrar el error
                        logger.error(f"Stock insuficiente para {item_carrito.producto.nombre} al procesar orden {orden.id}")
                else:
                    logger.warning(f"No hay stock registrado para {item_carrito.producto.nombre} en ninguna tienda")
            
            # Vaciar el carrito
            carrito.items.all().delete()
            logger.info(f"Orden simulada {orden.id} creada y carrito {carrito.id} vaciado.")

            return Response({
                'status': 'success',
                'order_id': str(orden.id),
                'payment_id': orden.payment_id,
                'message': 'Pago simulado procesado exitosamente'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error procesando pago simulado: {e}")
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        item_id = request.data.get('item_id')
        new_quantity = int(request.data.get('new_quantity'))

        if not item_id or new_quantity is None:
            return Response({'error': 'Item ID and new quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = ItemCarrito.objects.get(id=item_id)
            # Optional: Add checks if the current user/guest owns this cart/item
            # if request.user.is_authenticated and item.carrito.usuario != request.user:
            #     return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            # elif not request.user.is_authenticated:
            #     guest_cart_id = request.data.get('guest_cart_id') # Need to pass guest_cart_id from frontend
            #     if str(item.carrito.id) != guest_cart_id:
            #          return Response({'error': 'Not authorized or invalid cart'}, status=status.HTTP_403_FORBIDDEN)


            item.cantidad = new_quantity
            item.save()
            # Re-fetch the cart to update totals in the frontend
            # Alternatively, calculate new total here and return
            # For simplicity, let's just return the updated item data
            updated_item_data = ItemCarritoSerializer(item).data
            return Response(updated_item_data, status=status.HTTP_200_OK)

        except ItemCarrito.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
             # Log the error for debugging
            print(f"Error updating item quantity: {e}")
            return Response({'error': 'An error occurred while updating quantity'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def get_order_details(self, request):
        """Obtener detalles de una orden específica"""
        payment_id = request.query_params.get('payment_id')
        external_reference = request.query_params.get('external_reference')
        
        if not payment_id and not external_reference:
            return Response(
                {'error': 'Se requiere payment_id o external_reference'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Buscar la orden por payment_id o external_reference
            if payment_id:
                orden = Orden.objects.get(payment_id=payment_id)
            else:
                orden = Orden.objects.get(id=external_reference)
            
            # Obtener los items de la orden
            items_orden = ItemOrden.objects.filter(orden=orden)
            
            # Preparar los datos de respuesta
            order_data = {
                'orderId': str(orden.id),
                'paymentId': orden.payment_id,
                'status': orden.estado,
                'total': float(orden.total),
                'fechaCreacion': orden.fecha_creacion.strftime('%d/%m/%Y'),
                'fechaEstimadaEntrega': (orden.fecha_creacion.replace(day=orden.fecha_creacion.day + 7)).strftime('%d/%m/%Y'),
                'items': [
                    {
                        'id': item.id,
                        'nombre': item.producto.nombre,
                        'cantidad': item.cantidad,
                        'precio': float(item.precio_unitario),
                        'imagen': item.producto.imagen_url or 'https://via.placeholder.com/50'
                    } for item in items_orden
                ],
                'customerInfo': {
                    'nombre': orden.nombre,
                    'email': orden.email,
                    'telefono': orden.telefono
                },
                'shippingInfo': {
                    'direccion': orden.direccion,
                    'ciudad': orden.ciudad,
                    'codigoPostal': orden.codigo_postal
                }
            }
            
            return Response(order_data, status=status.HTTP_200_OK)
            
        except Orden.DoesNotExist:
            return Response(
                {'error': 'Orden no encontrada'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error al obtener detalles de orden: {e}")
            return Response(
                {'error': 'Error interno del servidor'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def user_orders(self, request):
        """Obtener historial de órdenes del usuario autenticado"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Debes estar autenticado para ver tu historial de pedidos'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            # Obtener todas las órdenes del usuario, ordenadas por fecha de creación (más recientes primero)
            ordenes = Orden.objects.filter(usuario=request.user).order_by('-fecha_creacion')
            
            # Preparar los datos de respuesta
            orders_data = []
            for orden in ordenes:
                # Obtener los items de la orden
                items_orden = ItemOrden.objects.filter(orden=orden)
                
                order_data = {
                    'orderId': str(orden.id),
                    'paymentId': orden.payment_id,
                    'status': orden.estado,
                    'total': float(orden.total),
                    'fechaCreacion': orden.fecha_creacion.strftime('%d/%m/%Y'),
                    'fechaEstimadaEntrega': (orden.fecha_creacion.replace(day=orden.fecha_creacion.day + 7)).strftime('%d/%m/%Y'),
                    'items': [
                        {
                            'id': item.id,
                            'nombre': item.producto.nombre,
                            'cantidad': item.cantidad,
                            'precio': float(item.precio_unitario),
                            'imagen': item.producto.imagen_url or 'https://via.placeholder.com/50'
                        } for item in items_orden
                    ],
                    'customerInfo': {
                        'nombre': orden.nombre,
                        'email': orden.email,
                        'telefono': orden.telefono
                    },
                    'shippingInfo': {
                        'direccion': orden.direccion,
                        'ciudad': orden.ciudad,
                        'codigoPostal': orden.codigo_postal
                    }
                }
                orders_data.append(order_data)
            
            return Response(orders_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error al obtener historial de órdenes: {e}")
            return Response(
                {'error': 'Error interno del servidor'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
