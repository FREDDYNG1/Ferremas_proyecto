import { useState } from 'react';
import axios from 'axios';

const CrearUsuarioForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    telefono: '',
    rol: 'trabajador',
    rut: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (formData.password !== formData.confirmPassword && formData.rol !== 'admin') {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const payload = { ...formData };
      delete payload.confirmPassword;

      const response = await axios.post('http://localhost:8000/api/usuarios/crear-usuario/', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensaje('✅ Usuario creado exitosamente');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        direccion: '',
        comuna: '',
        ciudad: '',
        telefono: '',
        rol: 'trabajador',
        rut: ''
      });
    } catch (err) {
      console.error(err);
      setError('❌ Error al crear el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h2>Crear usuario</h2>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input type="text" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} required />
      <input type="text" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />

      <select name="rol" value={formData.rol} onChange={handleChange} required>
        <option value="trabajador">Trabajador</option>
        <option value="admin">Administrador</option>
      </select>

      {formData.rol === 'admin' ? (
        <>
          <input type="text" name="rut" placeholder="RUT (para contraseña)" value={formData.rut} onChange={handleChange} required />
        </>
      ) : (
        <>
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} required />
        </>
      )}

      <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
      <input type="text" name="comuna" placeholder="Comuna" value={formData.comuna} onChange={handleChange} />
      <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
      <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />

      <button type="submit" style={{ marginTop: '10px' }}>
        Crear usuario
      </button>
    </form>
  );
};

export default CrearUsuarioForm;
