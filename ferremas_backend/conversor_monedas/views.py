from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .api import convertir_moneda  # función que ya tienes implementada

class ConvertirMonedaAPIView(APIView):
    def post(self, request):
        try:
            # Recibimos el JSON desde request.data
            cantidad = float(request.data.get("cantidad", 1))
            moneda_origen = request.data.get("origen", "USD")
            moneda_destino = request.data.get("destino", "EUR")

            resultado = convertir_moneda(cantidad, moneda_origen, moneda_destino)

            if resultado is None:
                return Response({"error": "Conversión fallida"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "cantidad_origen": cantidad,
                "moneda_origen": moneda_origen,
                "moneda_destino": moneda_destino,
                "resultado": resultado
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
