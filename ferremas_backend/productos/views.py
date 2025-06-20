from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Producto, Tienda, StockTienda
from .serializers import ProductoSerializer, TiendaSerializer, StockTiendaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        Permitir acceso para listar, ver detalles y categorías sin autenticación.
        Requerir autenticación y rol admin o trabajador para otras acciones.
        """
        if self.action in ['list', 'retrieve', 'categories', 'stock_por_tienda']:
            permission_classes = [permissions.AllowAny]
        else:
            # Para crear, actualizar, eliminar: requiere autenticación y rol admin o trabajador
            permission_classes = [permissions.IsAuthenticated]
            # Verificar si el usuario autenticado tiene rol 'admin' o 'trabajador'
            if not (hasattr(self.request.user, 'role') and self.request.user.role in ['admin', 'trabajador']):
                # Si no es admin ni trabajador, denegar el permiso
                permission_classes.append(permissions.DjangoModelPermissions) # Usar un permiso que siempre falle si la comprobación anterior no pasa
                                                                              # o simplemente denegar en la vista
                # Una alternativa más explícita sería: raise PermissionDenied()

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Optionally filters products by category.
        """
        queryset = self.queryset
        categoria = self.request.query_params.get('categoria', None)
        if categoria is not None:
            queryset = queryset.filter(categoria=categoria)
        return queryset

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """
        Returns a list of unique product categories.
        """
        categories = Producto.objects.values_list('categoria', flat=True).distinct()
        return Response(list(categories))

    @action(detail=True, methods=['get'])
    def stock_por_tienda(self, request, pk=None):
        producto = self.get_object()
        stock = StockTienda.objects.filter(producto=producto)
        serializer = StockTiendaSerializer(stock, many=True)
        return Response(serializer.data)

class TiendaViewSet(viewsets.ModelViewSet):
    queryset = Tienda.objects.all()
    serializer_class = TiendaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """
        Permite el acceso sin autenticación para listar y ver detalles de tiendas.
        Requiere autenticación y rol de administrador para crear, actualizar o eliminar.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        Crea una nueva tienda.
        Solo usuarios administradores pueden crear tiendas.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """
        Actualiza una tienda existente.
        Solo usuarios administradores pueden actualizar tiendas.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Elimina una tienda.
        Solo usuarios administradores pueden eliminar tiendas.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def stock(self, request, pk=None):
        """
        Obtiene el stock de productos para una tienda específica.
        Accesible sin autenticación.
        """
        tienda = self.get_object()
        stock = StockTienda.objects.filter(tienda=tienda).select_related('producto')
        serializer = StockTiendaSerializer(stock, many=True)
        return Response(serializer.data)

class StockTiendaViewSet(viewsets.ModelViewSet):
    queryset = StockTienda.objects.all()
    serializer_class = StockTiendaSerializer

    @action(detail=True, methods=['post'])
    def ajustar_stock(self, request, pk=None):
        stock = self.get_object()
        cantidad = request.data.get('cantidad', 0)
        
        try:
            cantidad = int(cantidad)
            stock.cantidad += cantidad
            if stock.cantidad < 0:
                return Response(
                    {'error': 'No se puede tener stock negativo'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            stock.save()
            serializer = self.get_serializer(stock)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {'error': 'La cantidad debe ser un número entero'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def transferir_stock(self, request):
        producto_id = request.data.get('producto')
        tienda_origen_id = request.data.get('tienda_origen')
        tienda_destino_id = request.data.get('tienda_destino')
        cantidad = request.data.get('cantidad')

        try:
            cantidad = int(cantidad)
            stock_origen = StockTienda.objects.get(
                producto_id=producto_id,
                tienda_id=tienda_origen_id
            )
            stock_destino, created = StockTienda.objects.get_or_create(
                producto_id=producto_id,
                tienda_id=tienda_destino_id,
                defaults={'cantidad': 0, 'stock_minimo': 0}
            )

            if stock_origen.cantidad < cantidad:
                return Response(
                    {'error': 'No hay suficiente stock en la tienda de origen'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            stock_origen.cantidad -= cantidad
            stock_destino.cantidad += cantidad
            stock_origen.save()
            stock_destino.save()

            return Response({
                'origen': StockTiendaSerializer(stock_origen).data,
                'destino': StockTiendaSerializer(stock_destino).data
            })
        except StockTienda.DoesNotExist:
            return Response(
                {'error': 'Stock no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {'error': 'La cantidad debe ser un número entero'},
                status=status.HTTP_400_BAD_REQUEST
            )
@action(detail=True, methods=['get'])
def stock_por_tienda(self, request, pk=None):
    producto = self.get_object()
    stock = StockTienda.objects.filter(producto=producto)
    serializer = StockTiendaSerializer(stock, many=True)
    return Response(serializer.data)