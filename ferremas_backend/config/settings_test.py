from .settings import *

# Configuración específica para pruebas
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',
    }
}

# Configuraciones adicionales para pruebas
DEBUG = False
TEMPLATES[0]['OPTIONS']['debug'] = False

# Deshabilitar logging durante pruebas
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'root': {
        'handlers': ['null'],
    },
}

# Configuración de caché para pruebas
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Configuración de archivos estáticos para pruebas
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Configuración de media para pruebas
MEDIA_ROOT = BASE_DIR / 'test_media'

# Configuración de email para pruebas
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Configuración de Supabase para pruebas (mock)
SUPABASE_URL = "https://test.supabase.co"
SUPABASE_KEY = "test_key" 