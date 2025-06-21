import mercadopago
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class MercadoPagoService:
    """Servicio para interactuar con la API de MercadoPago"""
    
    def __init__(self):
        self.access_token = getattr(settings, 'MP_ACCESS_TOKEN', os.getenv('MP_ACCESS_TOKEN'))
        if not self.access_token:
            logger.error("MP_ACCESS_TOKEN no está configurado.")
            raise ValueError("MercadoPago access token no configurado")
        self.sdk = mercadopago.SDK(self.access_token)
    
    def create_preference(self, items, metadata=None, external_reference=None, payer_email=None):
        """Crea una preferencia de pago en MercadoPago"""

        # URLs de redirección para el frontend
        frontend_url = "http://localhost:5173"
        
        back_urls = {
            "success": f"{frontend_url}/checkout/success",
            "failure": f"{frontend_url}/checkout/failure",
            "pending": f"{frontend_url}/checkout/pending",
        }

        preference_data = {
            "items": items,
            "back_urls": back_urls,
            "external_reference": external_reference,
            "metadata": metadata,
        }
        
        if payer_email:
            preference_data["payer"] = { "email": payer_email }
        
        logger.info(f"Creando preferencia de MP con datos: {preference_data}")
        
        try:
            preference_response = self.sdk.preference().create(preference_data)
            
            if (preference_response.get("status") == 201 or preference_response.get("status") == 200):
                logger.info("Preferencia de MP creada exitosamente.")
                response_data = preference_response.get("response", {})
                return {
                    "preference_id": response_data.get("id"),
                    "sandbox_init_point": response_data.get("sandbox_init_point"),
                    "init_point": response_data.get("init_point")
                }
            else:
                logger.error(f"Error en respuesta de MercadoPago SDK: {preference_response}")
                return None
        except Exception as e:
            logger.error(f"Excepción al crear preferencia en MercadoPago: {type(e).__name__} - {e}")
            return None
    
    def get_payment_info(self, payment_id):
        """Obtiene información de un pago por su ID"""
        try:
            payment_info = self.sdk.payment().get(payment_id)
            if "response" in payment_info:
                return payment_info["response"]
            return None
        except Exception as e:
            logger.error(f"Error al obtener información de pago: {e}")
            return None