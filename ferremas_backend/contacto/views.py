from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from .serializers import MensajeContactoSerializer
from .models import MensajeContacto
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from datetime import datetime, timedelta

# Create your views here.

class ContactoPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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

class MensajesContactoAPIView(APIView):
    """
    Vista para listar y gestionar mensajes de contacto.
    Solo accesible para administradores y trabajadores.
    """
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ContactoPagination
    
    def get_permissions(self):
        """Verificar que el usuario sea admin o trabajador"""
        if not hasattr(self.request.user, 'role') or self.request.user.role not in ['admin', 'trabajador']:
            return [permissions.IsAuthenticated()]  # Esto denegará el acceso
        return super().get_permissions()
    
    def get(self, request):
        """Lista mensajes con paginación, filtros y búsqueda"""
        # Obtener parámetros de consulta
        search = request.query_params.get('search', '')
        fecha_desde = request.query_params.get('fecha_desde', '')
        fecha_hasta = request.query_params.get('fecha_hasta', '')
        asunto = request.query_params.get('asunto', '')
        ordenar_por = request.query_params.get('ordenar_por', '-fecha_envio')
        
        # Query base
        queryset = MensajeContacto.objects.all()
        
        # Aplicar filtros de búsqueda
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(email__icontains=search) |
                Q(asunto__icontains=search) |
                Q(mensaje__icontains=search)
            )
        
        # Filtro por asunto
        if asunto:
            queryset = queryset.filter(asunto__icontains=asunto)
        
        # Filtros de fecha
        if fecha_desde:
            try:
                fecha_desde = datetime.strptime(fecha_desde, '%Y-%m-%d')
                queryset = queryset.filter(fecha_envio__date__gte=fecha_desde.date())
            except ValueError:
                pass
        
        if fecha_hasta:
            try:
                fecha_hasta = datetime.strptime(fecha_hasta, '%Y-%m-%d')
                queryset = queryset.filter(fecha_envio__date__lte=fecha_hasta.date())
            except ValueError:
                pass
        
        # Ordenar
        if ordenar_por in ['fecha_envio', '-fecha_envio', 'nombre', '-nombre', 'email', '-email']:
            queryset = queryset.order_by(ordenar_por)
        else:
            queryset = queryset.order_by('-fecha_envio')
        
        # Aplicar paginación
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        
        if page is not None:
            serializer = MensajeContactoSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = MensajeContactoSerializer(queryset, many=True)
        return Response(serializer.data)

class MensajeContactoDetalleAPIView(APIView):
    """
    Vista para obtener detalles o eliminar un mensaje específico
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Verificar que el usuario sea admin o trabajador"""
        if not hasattr(self.request.user, 'role') or self.request.user.role not in ['admin', 'trabajador']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
    
    def get(self, request, mensaje_id):
        """Obtener detalles de un mensaje específico"""
        try:
            mensaje = MensajeContacto.objects.get(id=mensaje_id)
            serializer = MensajeContactoSerializer(mensaje)
            return Response(serializer.data)
        except MensajeContacto.DoesNotExist:
            return Response({'error': 'Mensaje no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, mensaje_id):
        """Eliminar un mensaje específico"""
        try:
            mensaje = MensajeContacto.objects.get(id=mensaje_id)
            mensaje.delete()
            return Response({'message': 'Mensaje eliminado exitosamente'}, status=status.HTTP_204_NO_CONTENT)
        except MensajeContacto.DoesNotExist:
            return Response({'error': 'Mensaje no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class EstadisticasContactoAPIView(APIView):
    """
    Vista para obtener estadísticas de mensajes de contacto
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Verificar que el usuario sea admin o trabajador"""
        if not hasattr(self.request.user, 'role') or self.request.user.role not in ['admin', 'trabajador']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
    
    def get(self, request):
        """Obtener estadísticas de mensajes"""
        from django.db.models import Count
        from django.utils import timezone
        
        # Fecha actual
        ahora = timezone.now()
        
        # Mensajes de hoy
        mensajes_hoy = MensajeContacto.objects.filter(
            fecha_envio__date=ahora.date()
        ).count()
        
        # Mensajes de esta semana
        inicio_semana = ahora - timedelta(days=7)
        mensajes_semana = MensajeContacto.objects.filter(
            fecha_envio__gte=inicio_semana
        ).count()
        
        # Mensajes de este mes
        inicio_mes = ahora.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        mensajes_mes = MensajeContacto.objects.filter(
            fecha_envio__gte=inicio_mes
        ).count()
        
        # Total de mensajes
        total_mensajes = MensajeContacto.objects.count()
        
        # Mensajes sin leer (más de 24 horas sin respuesta)
        mensajes_sin_leer = MensajeContacto.objects.filter(
            fecha_envio__lt=ahora - timedelta(hours=24)
        ).count()
        
        return Response({
            'mensajes_hoy': mensajes_hoy,
            'mensajes_semana': mensajes_semana,
            'mensajes_mes': mensajes_mes,
            'total_mensajes': total_mensajes,
            'mensajes_sin_leer': mensajes_sin_leer
        })
