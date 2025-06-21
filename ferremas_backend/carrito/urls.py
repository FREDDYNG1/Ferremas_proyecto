from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarritoViewSet

router = DefaultRouter()
router.register(r'carritos', CarritoViewSet, basename='carrito')

urlpatterns = [
    path('', include(router.urls)),
    path('carritos/user_orders/', CarritoViewSet.as_view({'get': 'user_orders'}), name='user_orders'),
]