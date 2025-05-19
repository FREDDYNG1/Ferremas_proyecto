from .views import (
    RegistroUsuarioAPIView, CustomTokenObtainPairView,
    VistaProtegidaAPIView, CrearUsuarioPorAdminAPIView,
    CambiarPasswordAPIView, UsuarioListView
)
from django.urls import path

urlpatterns = [
    path('registro/', RegistroUsuarioAPIView.as_view(), name='registro'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('protegido/', VistaProtegidaAPIView.as_view(), name='protegido'),
    path('crear-usuario/', CrearUsuarioPorAdminAPIView.as_view(), name='crear_usuario'),
    path('cambiar-password/', CambiarPasswordAPIView.as_view(), name='cambiar_password'),
    path('usuarios/', UsuarioListView.as_view(), name='lista_usuarios'),
]
