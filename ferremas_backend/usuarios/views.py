from rest_framework import generics, status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomerUser
from .serializers import UsuarioSerializer, CrearUsuarioPorAdminSerializer

class EsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class RegistroUsuarioAPIView(generics.CreateAPIView):
    queryset = CustomerUser.objects.all()
    serializer_class = UsuarioSerializer

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
