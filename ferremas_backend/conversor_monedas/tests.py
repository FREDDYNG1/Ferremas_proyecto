from django.test import TestCase
from unittest.mock import patch
from . import api

class ConversorMonedasTestCase(TestCase):
    def tasas_side_effect(self, moneda_base='USD'):
        if moneda_base == 'USD':
            return {'conversion_rates': {'USD': 1.0, 'EUR': 0.9, 'CLP': 900.0}}
        elif moneda_base == 'EUR':
            return {'conversion_rates': {'USD': 1.1, 'EUR': 1.0, 'CLP': 1000.0}}
        elif moneda_base == 'CLP':
            return {'conversion_rates': {'USD': 0.0011, 'EUR': 0.0009, 'CLP': 1.0}}
        return None

    @patch('conversor_monedas.api.obtener_tasas_cambio')
    def test_convertir_monedas_basicas(self, mock_obtener_tasas):
        mock_obtener_tasas.side_effect = self.tasas_side_effect
        # USD a EUR
        self.assertAlmostEqual(api.convertir_moneda(100, 'USD', 'EUR'), 90.0)
        # USD a CLP
        self.assertAlmostEqual(api.convertir_moneda(2, 'USD', 'CLP'), 1800.0)
        # EUR a USD
        self.assertAlmostEqual(api.convertir_moneda(10, 'EUR', 'USD'), 11.0)
        # CLP a USD
        self.assertAlmostEqual(api.convertir_moneda(1000, 'CLP', 'USD'), 1.1)
        # Moneda destino no disponible
        self.assertIsNone(api.convertir_moneda(10, 'USD', 'ABC'))
