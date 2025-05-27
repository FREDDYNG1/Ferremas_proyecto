from django.db import models
from productos.models import Producto
from django.conf import settings
import uuid # Importar uuid para usar en UUIDField

# Create your models here.




class Carrito(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # Cambiar el campo ID a UUIDField
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)


    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Carrito de {self.usuario.username if self.usuario else 'invitado'}"
    
    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

class ItemCarrito(models.Model):
    # Relacion con el carrito al que pertenece el item
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name='items')
    # Relacion con el producto que se agrega al carrito
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    # Cantidad del producto en el carrito
    cantidad = models.PositiveIntegerField(default=1)
    fecha_añadido = models.DateTimeField(auto_now_add=True)


    class Meta:
        #esto asegura que un producto solo pueda aparecer en un carrito a la vez
        unique_together = ('carrito', 'producto')


    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en el carrito{self.carrito.id}"
    
    #propiedad para calcular el subtotal del item (cantidad * precio del producto)
    @property
    def subtotal(self):
        return self.producto.precio * self.cantidad
    

class Orden(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Información de contacto
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    
    # Información de envío
    direccion = models.CharField(max_length=200)
    ciudad = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10)
    
    # Información de pago
    metodo_pago = models.CharField(max_length=50)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"Orden {self.id} - {self.estado}"

class ItemOrden(models.Model):
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario
    
    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en orden {self.orden.id}"
    



