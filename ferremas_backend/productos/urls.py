from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, TiendaViewSet, StockTiendaViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'tiendas', TiendaViewSet)
router.register(r'stock-tienda', StockTiendaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
