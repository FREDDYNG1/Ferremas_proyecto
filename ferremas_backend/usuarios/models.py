from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomerUser(AbstractUser):
    ROLES = [
        ('cliente', 'Cliente'),
        ('admin', 'Administrador'),
        ('trabajador', 'Trabajador'),
    ]
    role = models.CharField(max_length=50, choices=ROLES, default='cliente')
    
    email = models.EmailField(unique=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    comuna = models.CharField(max_length=100, null=True, blank=True)
    ciudad = models.CharField(max_length=100, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    
    requiere_cambio_password = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    
