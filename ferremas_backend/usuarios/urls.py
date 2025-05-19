from .views import (
    RegistroUsuarioAPIView, CustomTokenObtainPairView,
    VistaProtegidaAPIView, CrearUsuarioPorAdminAPIView,
    CambiarPasswordAPIView, UsuarioListView,
    EditarTrabajadorAPIView, EliminarTrabajadorAPIView,
    DetalleTrabajadorAPIView
)
from django.urls import path

urlpatterns = [
    path('registro/', RegistroUsuarioAPIView.as_view(), name='registro'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('protegido/', VistaProtegidaAPIView.as_view(), name='protegido'),
    path('crear-usuario/', CrearUsuarioPorAdminAPIView.as_view(), name='crear_usuario'),
    path('cambiar-password/', CambiarPasswordAPIView.as_view(), name='cambiar_password'),
    path('', UsuarioListView.as_view(), name='lista_usuarios'),
    path('trabajador/<int:id>/', DetalleTrabajadorAPIView.as_view(), name='detalle_trabajador'),
    path('trabajador/<int:id>/editar/', EditarTrabajadorAPIView.as_view(), name='editar_trabajador'),
    path('trabajador/<int:id>/eliminar/', EliminarTrabajadorAPIView.as_view(), name='eliminar_trabajador'),
]
