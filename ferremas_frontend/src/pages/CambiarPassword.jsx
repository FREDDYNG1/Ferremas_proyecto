import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CambiarPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/usuarios/cambiar-password/', {
        nueva_password: password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Después de cambiar la contraseña, redirige según el rol
      const role = localStorage.getItem('role');
      if (role === 'admin') navigate('/admin');
      else if (role === 'trabajador') navigate('/trabajador');
      else navigate('/');
    } catch (err) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Cambiar contraseña</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        /><br />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default CambiarPassword;
