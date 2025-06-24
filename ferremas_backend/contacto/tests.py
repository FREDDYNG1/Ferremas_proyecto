from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch

class ContactoEmailTest(TestCase):
    @patch('contacto.views.send_mail')
    def test_envio_email_al_enviar_contacto(self, mock_send_mail):
        url = reverse('contacto')
        data = {
            "nombre": "Juan Pérez",
            "email": "juan@example.com",
            "asunto": "Consulta de prueba",
            "mensaje": "¿Tienen stock de martillos?"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(mock_send_mail.called)

