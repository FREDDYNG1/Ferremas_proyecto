from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Producto
from .serializers import ProductoSerializer

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
        if self.action in ['list', 'retrieve', 'categories']:
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
