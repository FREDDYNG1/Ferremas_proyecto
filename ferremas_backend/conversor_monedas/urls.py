from django.urls import path
from .views import ConvertirMonedaAPIView

urlpatterns = [
    path('convertir-moneda/', ConvertirMonedaAPIView.as_view(), name='convertir_moneda'),
]
