from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Carrito, ItemCarrito
from productos.models import Producto
from .serializers import ItemCarritoSerializer, CarritoSerializer
from .mercadopago_service import MercadoPagoService
import logging

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

        try:
            # Obtener el item del carrito
            item = ItemCarrito.objects.get(id=item_id)
            
            # Verificar que el usuario tenga permiso para eliminar el item
            if user.is_authenticated:
                if item.carrito.usuario != user:
                    return Response({'error': 'No tienes permiso para eliminar este item'}, status=status.HTTP_403_FORBIDDEN)
            else:
                if str(item.carrito.id) != guest_cart_id:
                    return Response({'error': 'No tienes permiso para eliminar este item'}, status=status.HTTP_403_FORBIDDEN)

            # Eliminar el item
            item.delete()
            
            return Response({'message': 'Item eliminado exitosamente'}, status=status.HTTP_200_OK)
            
        except ItemCarrito.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error al eliminar item: {e}")
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
        carrito = self._get_cart(request.user, guest_cart_id)
        
        if not carrito or not carrito.items.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Convertir items del carrito al formato que espera MercadoPago
        items_mp = [{
            "title": item.producto.nombre,
            "quantity": item.cantidad,
            "unit_price": float(item.producto.precio),
            "currency_id": "CLP"
        } for item in carrito.items.all()]
        
        # Usar el servicio para crear la preferencia
        preference = self.mercadopago_service.create_preference(items_mp)
        
        if not preference:
            return Response(
                {'error': 'Error en la respuesta de Mercado Pago'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        return Response(preference, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def webhook(self, request):
        payment_id = request.data.get("data", {}).get("id")
        if not payment_id:
            return Response({"status": "ignored"})
            
        # Usar el servicio para obtener información del pago
        payment_info = self.mercadopago_service.get_payment_info(payment_id)
        
        if payment_info:
            # Aquí puedes actualizar el estado de la orden según payment_info["status"]
            # Posiblemente crear un método separado para esta lógica
            return Response({"status": "ok"})
            
        return Response({"status": "error", "message": "No se pudo obtener información del pago"}, 
                      status=status.HTTP_400_BAD_REQUEST)
                      
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
            #     if not guest_cart_id or str(item.carrito.id) != guest_cart_id:
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
