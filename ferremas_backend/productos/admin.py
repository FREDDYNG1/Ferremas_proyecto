from django.contrib import admin
from .models import Producto, Tienda, StockTienda

# Register your models here.
admin.site.register(Producto)
admin.site.register(Tienda)
admin.site.register(StockTienda)
