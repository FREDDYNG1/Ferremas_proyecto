import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Chip
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  const [showSimulatedWarning, setShowSimulatedWarning] = useState(false);

  const handleMethodChange = (event) => {
    const method = event.target.value;
    onMethodChange(method);
    
    if (method === 'simulated') {
      setShowSimulatedWarning(true);
    } else {
      setShowSimulatedWarning(false);
    }
  };

  const paymentMethods = [
    {
      id: 'mercadopago',
      name: 'MercadoPago',
      description: 'Pago seguro con tarjeta de crédito, débito o transferencia',
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#009EE3' }} />,
      features: [
        'Tarjetas de crédito y débito',
        'Transferencias bancarias',
        'Billetera digital',
        'Pago en cuotas'
      ],
      color: '#009EE3'
    },
    {
      id: 'simulated',
      name: 'Pago Simulado',
      description: 'Simulación de pago para desarrollo y testing',
      icon: <CreditCardIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      features: [
        'Pago instantáneo simulado',
        'Sin cargo real',
        'Ideal para testing',
        'Orden creada inmediatamente'
      ],
      color: '#FF9800'
    }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Método de Pago
      </Typography>

      {showSimulatedWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Modo de desarrollo:</strong> Este método simula un pago exitoso sin realizar ningún cargo real. 
            Es ideal para probar la funcionalidad de la aplicación.
          </Typography>
        </Alert>
      )}

      <RadioGroup
        value={selectedMethod}
        onChange={handleMethodChange}
        sx={{ mt: 2 }}
      >
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            sx={{
              mb: 2,
              border: selectedMethod === method.id ? `2px solid ${method.color}` : '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: method.color,
                boxShadow: 2
              }
            }}
            onClick={() => onMethodChange(method.id)}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <FormControlLabel
                  value={method.id}
                  control={<Radio />}
                  label=""
                  sx={{ mr: 1 }}
                />
                <Box sx={{ mr: 2 }}>
                  {method.icon}
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" component="div">
                    {method.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method.description}
                  </Typography>
                </Box>
                {method.id === 'simulated' && (
                  <Chip 
                    label="DEV" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                  />
                )}
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1}>
                {method.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      {selectedMethod === 'mercadopago' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Serás redirigido a MercadoPago para completar tu pago de forma segura.
          </Typography>
        </Alert>
      )}

      {selectedMethod === 'simulated' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Tu orden será procesada inmediatamente sin realizar ningún cargo.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default PaymentMethodSelector; 