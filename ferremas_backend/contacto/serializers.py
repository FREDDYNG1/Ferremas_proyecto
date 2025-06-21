from rest_framework import serializers
from .models import MensajeContacto
from datetime import datetime

class MensajeContactoSerializer(serializers.ModelSerializer):
    fecha_envio_formateada = serializers.SerializerMethodField()
    tiempo_transcurrido = serializers.SerializerMethodField()
    
    class Meta:
        model = MensajeContacto
        fields = ['id', 'nombre', 'email', 'asunto', 'mensaje', 'fecha_envio', 'fecha_envio_formateada', 'tiempo_transcurrido']
        read_only_fields = ['id', 'fecha_envio', 'fecha_envio_formateada', 'tiempo_transcurrido']
    
    def get_fecha_envio_formateada(self, obj):
        """Formatea la fecha para mostrar en formato legible"""
        if obj.fecha_envio:
            return obj.fecha_envio.strftime('%d/%m/%Y %H:%M')
        return ''
    
    def get_tiempo_transcurrido(self, obj):
        """Calcula el tiempo transcurrido desde el envío del mensaje"""
        if obj.fecha_envio:
            ahora = datetime.now()
            diferencia = ahora - obj.fecha_envio.replace(tzinfo=None)
            
            if diferencia.days > 0:
                return f"Hace {diferencia.days} día{'s' if diferencia.days != 1 else ''}"
            elif diferencia.seconds > 3600:
                horas = diferencia.seconds // 3600
                return f"Hace {horas} hora{'s' if horas != 1 else ''}"
            elif diferencia.seconds > 60:
                minutos = diferencia.seconds // 60
                return f"Hace {minutos} minuto{'s' if minutos != 1 else ''}"
            else:
                return "Hace unos momentos"
        return ''
