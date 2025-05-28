from django.urls import path
from .views import ContactoAPIView

urlpatterns = [
    path('contacto/', ContactoAPIView.as_view(), name='contacto'),
] 