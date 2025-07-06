# Documentación de Tests - Ferremas Backend

## Descripción General

Este documento describe los tests implementados en el proyecto Ferremas Backend, incluyendo su propósito, estructura y cómo ejecutarlos.

## Estructura de Tests

### 1. Tests de Productos (`productos/tests.py`)

#### Clase: `TestProductoBasico`
**Propósito**: Verificar la funcionalidad básica de los modelos de productos.

**Tests incluidos**:

- **`test_crear_producto`**
  - Verifica la creación de productos con datos mínimos
  - Valida que los campos se guarden correctamente
  - Datos de prueba: SKU=TEST001, Nombre=Martillo, Precio=$25.00

- **`test_crear_tienda`**
  - Verifica la creación de tiendas
  - Valida el estado activo por defecto
  - Datos de prueba: Ferretería Central

- **`test_crear_stock`**
  - Verifica la relación entre productos y tiendas
  - Valida la gestión de inventario
  - Datos de prueba: 10 unidades de Destornillador

### 2. Tests de Conversor de Monedas (`conversor_monedas/tests.py`)

#### Clase: `ConversorMonedasTestCase`
**Propósito**: Verificar la funcionalidad del conversor de monedas.

**Tests incluidos**:

- **`test_convertir_monedas_basicas`**
  - Verifica conversiones entre USD, EUR y CLP
  - Incluye 5 casos de prueba:
    1. USD → EUR (100 USD = 90 EUR)
    2. USD → CLP (2 USD = 1800 CLP)
    3. EUR → USD (10 EUR = 11 USD)
    4. CLP → USD (1000 CLP = 1.1 USD)
    5. Moneda no disponible (debe retornar None)

## Cómo Ejecutar los Tests

### Ejecutar todos los tests
```bash
cd ferremas_backend
python manage.py test
```

### Ejecutar tests específicos
```bash
# Tests de productos
python manage.py test productos.tests -v 2

# Tests de conversor de monedas
python manage.py test conversor_monedas.tests -v 2

# Test específico
python manage.py test productos.tests.TestProductoBasico.test_crear_producto -v 2
```

### Ejecutar tests con cobertura
```bash
# Instalar coverage si no está instalado
pip install coverage

# Ejecutar tests con cobertura
coverage run --source='.' manage.py test
coverage report
coverage html  # Genera reporte HTML
```

## Convenciones de Naming

- **Clases de Test**: `Test[Modulo][Funcionalidad]` (ej: `TestProductoBasico`)
- **Métodos de Test**: `test_[descripcion_funcionalidad]` (ej: `test_crear_producto`)
- **Archivos de Test**: `tests.py` o `test_[modulo].py`

## Estructura de un Test

```python
class TestEjemplo(TestCase):
    """
    Docstring de la clase describiendo el propósito general
    """
    
    def test_funcionalidad(self):
        """
        Docstring del test describiendo:
        - Qué prueba
        - Datos de entrada
        - Resultado esperado
        """
        # Arrange: Preparar datos
        # Act: Ejecutar funcionalidad
        # Assert: Verificar resultados
```

## Mejores Prácticas

1. **Documentación**: Cada test debe tener docstring explicando su propósito
2. **Nombres descriptivos**: Los nombres deben ser claros y descriptivos
3. **Datos de prueba**: Usar datos realistas pero simples
4. **Independencia**: Cada test debe ser independiente de otros
5. **Limpieza**: Usar `setUp()` y `tearDown()` cuando sea necesario

## Casos de Prueba Cubiertos

### Productos
- ✅ Creación de productos
- ✅ Creación de tiendas
- ✅ Gestión de stock
- ❌ Validaciones de campos
- ❌ Casos de error
- ❌ Tests de API

### Conversor de Monedas
- ✅ Conversiones básicas
- ✅ Manejo de monedas no disponibles
- ❌ Tests de API externa
- ❌ Casos de error de red

## Próximos Pasos

1. Agregar tests para validaciones de campos
2. Implementar tests de API endpoints
3. Agregar tests de casos de error
4. Implementar tests de integración
5. Agregar tests de performance

## Notas Importantes

- Los tests usan la base de datos de prueba de Django
- Se utilizan mocks para servicios externos (conversor de monedas)
- Los tests son independientes y se pueden ejecutar en cualquier orden
- Se recomienda ejecutar los tests antes de cada commit 