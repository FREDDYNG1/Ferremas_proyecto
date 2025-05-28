import requests
from django.conf import settings

API_BASE_URL = "https://v6.exchangerate-api.com/v6/"

def obtener_tasas_cambio(moneda_base='USD'):
    api_key = getattr(settings, 'CURRENCY_API_KEY', None) # Usamos getattr para evitar AttributeError si no existe
    if not api_key:
        print("Error: La clave CURRENCY_API_KEY no está configurada en settings. Asegúrate de que esté en .env y cargada.")
        return None

    # Construye la URL del endpoint 'latest'
    url = f"{API_BASE_URL}{api_key}/latest/{moneda_base}"

    try:
        respuesta = requests.get(url)
        respuesta.raise_for_status() # Lanza una excepción para códigos de estado de error (4xx o 5xx)

        try:
            datos = respuesta.json()

            if datos.get('result') == 'success':
                if 'conversion_rates' in datos:
                     return datos
                else:
                     print("Error: La respuesta de la API es 'success' pero no contiene 'conversion_rates'.")
                     return None
            else:
                 print(f"Error de la API (resultado no 'success'): {datos.get('error-type', 'Error desconocido')}")
  
                 return None
        except json.JSONDecodeError: 
            print("Error: No se pudo decodificar la respuesta JSON de la API.")
           
            return None


    except requests.exceptions.RequestException as e:
        print(f"Error de conexión o respuesta de la API: {e}")
 
        return None
    except Exception as e:
        print(f"Ocurrió un error inesperado al obtener tasas: {e}")
        return None


def convertir_moneda(cantidad, moneda_origen, moneda_destino):

    datos_tasas = obtener_tasas_cambio(moneda_base=moneda_origen)

    if not datos_tasas or 'conversion_rates' not in datos_tasas:
        # El mensaje de error más específico ya debería haberse impreso en obtener_tasas_cambio
        print("Error: Falló la obtención de tasas o el formato es incorrecto para la conversión.")
        return None

    tasas_disponibles = datos_tasas['conversion_rates'] # La API v6 usa 'conversion_rates'

    # Verificamos que las monedas de destino estén disponibles en las tasas
    if moneda_destino not in tasas_disponibles:
        print(f"Error: La moneda de destino '{moneda_destino}' no está disponible en las tasas obtenidas para la moneda base '{moneda_origen}'.")
        # Considera loggear las tasas disponibles en producción si esto ocurre
        return None

    try:
        # La tasa es cuánto obtienes de moneda_destino por 1 unidad de moneda_origen (la base de la solicitud API)
        tasa_conversion = tasas_disponibles[moneda_destino]
        cantidad_convertida = cantidad * tasa_conversion
        return cantidad_convertida
    except (TypeError, ValueError) as e:
         print(f"Error al calcular la conversión (Tipos de datos/Valor): {e}")
         return None
    except Exception as e:
         print(f"Ocurrió un error inesperado al convertir moneda: {e}")
         return None


