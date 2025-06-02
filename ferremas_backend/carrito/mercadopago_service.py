import mercadopago
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class MercadoPagoService:
    """Servicio para interactuar con la API de MercadoPago"""
    
    def __init__(self):
        # Obtener el token desde settings o variables de entorno
        self.access_token = getattr(settings, 'MP_ACCESS_TOKEN', os.getenv('MP_ACCESS_TOKEN'))
        if not self.access_token:
            logger.error("MercadoPago access token no configurado")
            raise ValueError("MercadoPago access token no configurado")
        self.sdk = mercadopago.SDK(self.access_token)
    
    def create_preference(self, items, back_urls=None, external_reference=None):
        """
        Crea una preferencia de pago en MercadoPago
        
        Args:
            items: Lista de items para la preferencia
            back_urls: URLs de retorno para éxito/fallo/pendiente
            external_reference: Referencia externa (ej: ID de orden)
            
        Returns:
            dict: Datos de la preferencia creada o None si hay error
        """
        if not back_urls:
            back_urls = {
                "success": "http://localhost:5173/checkout/success",
                "failure": "http://localhost:5173/checkout/failure",
                "pending": "http://localhost:5173/checkout/pending",
            }
            
        preference_data = {
            "items": items,
            "back_urls": back_urls,
            # "auto_return": "approved",
        }
        
        if external_reference:
            preference_data["external_reference"] = external_reference
            
        try:
            preference_response = self.sdk.preference().create(preference_data)
            
            if (not preference_response or
                "response" not in preference_response or
                not preference_response["response"]):
                logger.error(f"Error en respuesta de MercadoPago: {preference_response}")
                return None
                
            return {
                "preference_id": preference_response["response"].get("id"),
                "sandbox_init_point": preference_response["response"].get("sandbox_init_point"),
                "init_point": preference_response["response"].get("init_point")
            }
        except Exception as e:
            logger.error(f"Error al crear preferencia en MercadoPago: {e}")
            return None
    
    def get_payment_info(self, payment_id):
        """
        Obtiene información de un pago por su ID
        
        Args:
            payment_id: ID del pago en MercadoPago
            
        Returns:
            dict: Información del pago o None si hay error
        """
        try:
            payment_info = self.sdk.payment().get(payment_id)
            if "response" in payment_info:
                return payment_info["response"]
            return None
        except Exception as e:
            logger.error(f"Error al obtener información de pago: {e}")
            return None