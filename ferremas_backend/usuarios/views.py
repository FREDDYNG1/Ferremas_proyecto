from rest_framework import generics, status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging

from .models import CustomerUser
from .serializers import UsuarioSerializer, CrearUsuarioPorAdminSerializer
from .permissions import EsAdministrador

logger = logging.getLogger(__name__)

class RegistroUsuarioAPIView(generics.CreateAPIView):
    queryset = CustomerUser.objects.all()
    serializer_class = UsuarioSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info(f"Datos recibidos en registro: {request.data}")
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error en registro de usuario: {str(e)}")
            logger.error(f"Tipo de error: {type(e).__name__}")
            raise

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Debe ingresar email y contraseña")

        try:
            user = CustomerUser.objects.get(email=email)
        except CustomerUser.DoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas")

        if not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError("Credenciales inválidas o cuenta inactiva.")

        attrs['username'] = user.username
        data = super().validate(attrs)
        data.update({
            'user_id': user.id,
            'role': user.role,
            'requiere_cambio_password': user.requiere_cambio_password
        })
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CrearUsuarioPorAdminAPIView(generics.CreateAPIView):
    queryset = CustomerUser.objects.all()
    serializer_class = CrearUsuarioPorAdminSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]

class UsuarioListView(generics.ListAPIView):
    queryset = CustomerUser.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]

    def get_queryset(self):
        queryset = super().get_queryset()
        rol = self.request.query_params.get('rol', None)
        if rol is not None:
            queryset = queryset.filter(role=rol)
        return queryset

class DetalleTrabajadorAPIView(generics.RetrieveAPIView):
    queryset = CustomerUser.objects.filter(role='trabajador')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]
    lookup_field = 'id'

class EditarTrabajadorAPIView(generics.UpdateAPIView):
    queryset = CustomerUser.objects.filter(role='trabajador')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "mensaje": "Trabajador actualizado correctamente",
            "trabajador": serializer.data
        })

class EliminarTrabajadorAPIView(generics.DestroyAPIView):
    queryset = CustomerUser.objects.filter(role='trabajador')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "mensaje": "Trabajador eliminado correctamente"
        }, status=status.HTTP_200_OK)

class CambiarPasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        nueva_password = request.data.get("nueva_password")
        if not nueva_password:
            return Response({"error": "Debes ingresar la nueva contraseña"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.set_password(nueva_password)
        user.requiere_cambio_password = False
        user.save()

        return Response({"mensaje": "Contraseña actualizada correctamente"})

class VistaProtegidaAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "mensaje": f"Hola, {request.user.first_name}! Accediste con JWT.",
            "usuario": request.user.email,
            "rol": request.user.role
        })

class PerfilUsuarioAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
