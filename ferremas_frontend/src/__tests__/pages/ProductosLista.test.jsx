// src/__tests__/pages/ProductoLista.test.jsx
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductosLista from '../../pages/productos/ProductosLista';

// Mocks del servicio productoService
vi.mock('../../../services/productoService', () => ({
  productoService: {
    getAll: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock del componente ProductoCard
vi.mock('../../../components/productos/ProductoCard', () => ({
  default: ({ producto, onDelete }) => (
    <div>
      <p>{producto.nombre}</p>
      <button onClick={() => onDelete(producto.id)}>Eliminar</button>
    </div>
  )
}));

describe('ProductosLista', () => {
  const { productoService } = require('../../../services/productoService');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra productos correctamente y permite eliminarlos', async () => {
    // Simula productos de prueba
    productoService.getAll.mockResolvedValue([
      { id: 1, nombre: 'Martillo', precio: 5000 },
      { id: 2, nombre: 'Destornillador', precio: 2000 }
    ]);

    productoService.delete.mockResolvedValue();

    render(
      <BrowserRouter>
        <ProductosLista />
      </BrowserRouter>
    );

    // Espera a que se carguen los productos
    await waitFor(() => {
      expect(screen.getByText('Martillo')).toBeInTheDocument();
      expect(screen.getByText('Destornillador')).toBeInTheDocument();
    });

    // Simula click en botón "Eliminar"
    fireEvent.click(screen.getAllByText('Eliminar')[0]);

    // Aparece el diálogo
    expect(await screen.findByText('Confirmar eliminación')).toBeInTheDocument();

    // Confirma la eliminación
    fireEvent.click(screen.getByText('Eliminar'));

    // Espera mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('¡Producto eliminado exitosamente!')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla la carga de productos', async () => {
    // Simula un fallo en la API
    productoService.getAll.mockRejectedValue(new Error('Error del servidor'));

    render(
      <BrowserRouter>
        <ProductosLista />
      </BrowserRouter>
    );

    // Espera el mensaje de error en el Snackbar
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar productos/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla la eliminación del producto', async () => {
    productoService.getAll.mockResolvedValue([
      { id: 1, nombre: 'Serrucho', precio: 3500 }
    ]);

    productoService.delete.mockRejectedValue(new Error('Falló eliminación'));

    render(
      <BrowserRouter>
        <ProductosLista />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Serrucho')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Eliminar'));
    expect(await screen.findByText('Confirmar eliminación')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Eliminar'));

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar el producto')).toBeInTheDocument();
    });
  });
});
