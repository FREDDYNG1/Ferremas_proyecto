// src/__tests__/components/CrearUsuarioForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import CrearUsuarioForm from '../../components/CrearUsuarioForm';

describe('CrearUsuarioForm', () => {
  it('renderiza el formulario y permite ingresar datos', () => {
    render(<CrearUsuarioForm />);
    
    const nombreInput = screen.getByLabelText(/nombre/i);
    fireEvent.change(nombreInput, { target: { value: 'Juan' } });
    expect(nombreInput.value).toBe('Juan');

    const emailInput = screen.getByLabelText(/correo/i);
    fireEvent.change(emailInput, { target: { value: 'juan@email.com' } });
    expect(emailInput.value).toBe('juan@email.com');
  });
});