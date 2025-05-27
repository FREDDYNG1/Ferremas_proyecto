from supabase import create_client
import os
from django.conf import settings
import time
import uuid

# Configuración de Supabase
SUPABASE_URL = "https://ygffsntgrdngvikqklma.supabase.co"
# Usar la clave de servicio en lugar de la clave anónima
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZmZzbnRncmRuZ3Zpa3FrbG1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU4NzM4OCwiZXhwIjoyMDYyMTYzMzg4fQ.fG-ATBTnoI9-D-sqZfjMd9hGo-bsJ1NtZL3E7ctY2q8"

# Inicializar el cliente de Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def ensure_bucket_exists(bucket_name):
    """
    Asegura que el bucket existe en Supabase
    """
    try:
        buckets = supabase.storage.list_buckets()
        bucket_exists = any(bucket.name == bucket_name for bucket in buckets)
        
        if not bucket_exists:
            supabase.storage.create_bucket(bucket_name, {'public': True})
            print(f"Bucket {bucket_name} creado exitosamente")
    except Exception as e:
        print(f"Error al verificar/crear bucket: {str(e)}")

def upload_file(file, bucket_name="productos"):
    try:
        # Asegurar que el bucket existe
        ensure_bucket_exists(bucket_name)
        
        # Generar un nombre único para el archivo con timestamp y UUID
        timestamp = int(time.time())
        unique_id = str(uuid.uuid4())[:8]
        file_extension = os.path.splitext(file.name)[1]
        file_name = f"{bucket_name}/{timestamp}_{unique_id}{file_extension}"
        
        # Leer el contenido del archivo
        file_content = file.read()
        
        # Subir el archivo
        result = supabase.storage.from_(bucket_name).upload(
            file_name,
            file_content,
            {"content-type": file.content_type}
        )
        
        # Obtener la URL pública del archivo
        file_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        return file_url
    except Exception as e:
        print(f"Error al subir el archivo: {str(e)}")
        return None

def delete_file(file_url, bucket_name="productos"):
    """
    Elimina un archivo del bucket de Supabase
    :param file_url: URL del archivo a eliminar
    :param bucket_name: Nombre del bucket
    :return: True si se eliminó correctamente, False en caso contrario
    """
    try:
        # Extraer el nombre del archivo de la URL
        file_name = file_url.split(f"{bucket_name}/")[-1]
        
        # Eliminar el archivo
        result = supabase.storage.from_(bucket_name).remove([file_name])
        
        return True
    except Exception as e:
        print(f"Error al eliminar el archivo: {str(e)}")
        return False 