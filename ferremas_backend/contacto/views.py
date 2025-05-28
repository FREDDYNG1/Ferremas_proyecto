from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MensajeContactoSerializer
from .models import MensajeContacto
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.

class ContactoAPIView(APIView):
    def post(self, request):
        serializer = MensajeContactoSerializer(data=request.data)
        if serializer.is_valid():
            mensaje = serializer.save()
            
            # Enviar correo electrónico
            if settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD:
                try:
                    email_body = f"""
                    Nuevo mensaje de contacto:
                    
                    Nombre: {mensaje.nombre}
                    Email: {mensaje.email}
                    Asunto: {mensaje.asunto or 'No especificado'}
                    
                    Mensaje:
                    {mensaje.mensaje}
                    """
                    
                    send_mail(
                        subject=f'Nuevo mensaje de contacto: {mensaje.asunto or "Sin asunto"}',
                        message=email_body,
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[settings.EMAIL_HOST_USER],
                        fail_silently=False,
                    )
                    print("Correo enviado exitosamente")
                except Exception as e:
                    print(f"Error al enviar correo: {str(e)}")
            else:
                print("DEBUG: Configuración de correo faltante. No se intentó enviar correo.")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """Lista todos los mensajes de contacto"""
        mensajes = MensajeContacto.objects.all().order_by('-fecha_envio')
        serializer = MensajeContactoSerializer(mensajes, many=True)
        return Response(serializer.data)
