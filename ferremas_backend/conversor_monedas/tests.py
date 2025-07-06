from django.test import TestCase
from unittest.mock import patch
from . import api

class ConversorMonedasTestCase(TestCase):
    """
    TestCase para el módulo de conversión de monedas.
    
    Este conjunto de pruebas verifica la funcionalidad del conversor de monedas,
    incluyendo conversiones entre diferentes divisas y el manejo de casos de error.
    
    Monedas soportadas en las pruebas:
    - USD (Dólar estadounidense)
    - EUR (Euro)
    - CLP (Peso chileno)
    """
    
    def tasas_side_effect(self, moneda_base='USD'):
        """
        Simula las tasas de cambio para diferentes monedas base.
        
        Args:
            moneda_base (str): Moneda base para obtener las tasas de cambio
            
        Returns:
            dict: Diccionario con las tasas de conversión simuladas
        """
        if moneda_base == 'USD':
            return {'conversion_rates': {'USD': 1.0, 'EUR': 0.9, 'CLP': 900.0}}
        elif moneda_base == 'EUR':
            return {'conversion_rates': {'USD': 1.1, 'EUR': 1.0, 'CLP': 1000.0}}
        elif moneda_base == 'CLP':
            return {'conversion_rates': {'USD': 0.0011, 'EUR': 0.0009, 'CLP': 1.0}}
        return None

    @patch('conversor_monedas.api.obtener_tasas_cambio')
    def test_convertir_monedas_basicas(self, mock_obtener_tasas):
        """
        Prueba las conversiones básicas entre diferentes monedas.
        
        Este test verifica:
        1. Conversión de USD a EUR (100 USD = 90 EUR)
        2. Conversión de USD a CLP (2 USD = 1800 CLP)
        3. Conversión de EUR a USD (10 EUR = 11 USD)
        4. Conversión de CLP a USD (1000 CLP = 1.1 USD)
        5. Manejo de moneda destino no disponible (debe retornar None)
        
        Args:
            mock_obtener_tasas: Mock del método obtener_tasas_cambio
        """
        mock_obtener_tasas.side_effect = self.tasas_side_effect
        
        # Test 1: USD a EUR - 100 USD debería ser 90 EUR
        self.assertAlmostEqual(api.convertir_moneda(100, 'USD', 'EUR'), 90.0)
        
        # Test 2: USD a CLP - 2 USD debería ser 1800 CLP
        self.assertAlmostEqual(api.convertir_moneda(2, 'USD', 'CLP'), 1800.0)
        
        # Test 3: EUR a USD - 10 EUR debería ser 11 USD
        self.assertAlmostEqual(api.convertir_moneda(10, 'EUR', 'USD'), 11.0)
        
        # Test 4: CLP a USD - 1000 CLP debería ser 1.1 USD
        self.assertAlmostEqual(api.convertir_moneda(1000, 'CLP', 'USD'), 1.1)
        
        # Test 5: Moneda destino no disponible - debe retornar None
        self.assertIsNone(api.convertir_moneda(10, 'USD', 'ABC'))
