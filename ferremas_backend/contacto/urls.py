from django.urls import path
from .views import (
    ContactoAPIView, 
    MensajesContactoAPIView, 
    MensajeContactoDetalleAPIView,
    EstadisticasContactoAPIView
)

urlpatterns = [
    path('contacto/', ContactoAPIView.as_view(), name='contacto'),
    path('contacto/mensajes/', MensajesContactoAPIView.as_view(), name='mensajes_contacto'),
    path('contacto/mensajes/<int:mensaje_id>/', MensajeContactoDetalleAPIView.as_view(), name='mensaje_detalle'),
    path('contacto/estadisticas/', EstadisticasContactoAPIView.as_view(), name='estadisticas_contacto'),
] 