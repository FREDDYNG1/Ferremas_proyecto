from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomerUser

@admin.register(CustomerUser)
class CustomUserAdmin(UserAdmin):
    model = CustomerUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ("Información adicional", {
            "fields": ("role", "direccion", "comuna", "ciudad", "telefono")
        }),
    )
