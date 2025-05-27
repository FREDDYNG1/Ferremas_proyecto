import { useCarrito } from '../../context/CarritoContext';

function CarritoProductos() {
  const { carrito, eliminarItem, loadingCarrito } = useCarrito();
  
  return (
    <div className="carrito-container">
      {carrito?.items && carrito.items.length > 0 ? (
        <div className="carrito-items">
          {carrito.items.map((item) => (
            <div key={item.id} className="carrito-item">
              {/* Información del producto */}
              <div className="producto-info">
                {item.producto_imagen_url && <img src={item.producto_imagen_url} alt={item.producto_nombre} className="producto-imagen-carrito" style={{ width: '50px', height: '50px', marginRight: '10px' }} />}
                <div>
                  <h3>{item.producto_nombre}</h3>
                  <p>Precio: ${item.producto_precio}</p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Subtotal: ${item.subtotal}</p>
                </div>
              </div>
              
              {/* Botón para eliminar */}
              <button 
                onClick={() => eliminarItem(item.id)}
                disabled={loadingCarrito}
                className="btn-eliminar"
              >
                {loadingCarrito ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          ))}
          
          <div className="carrito-total">
            <h3>Total: ${carrito.total || 0}</h3>
          </div>
        </div>
      ) : (
        <p>No hay productos en el carrito</p>
      )}
    </div>
  );
}

export default CarritoProductos;