import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { LiMensaje, UlMensajes } from './ui-components';
import logo from './perfil.png'; 
const socket = io('http://localhost:3000');


const initialStateValues = {
  usuario: '',
  mensaje: ''
};

function App() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);


  const [values, setValues] = useState(initialStateValues);

  useEffect(() => {

    socket.on('connect', () => setIsConnected(true));

    socket.on('chat_message', (data) => {
      setMensajes(mensajes => [...mensajes, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('chat_message');
    }

  }, []);

  const handleEnviar = (e) => {
    e.preventDefault();
    console.log(values)
  }


  const enviarMensaje = () => {
    socket.emit('chat_message', {
      usuario: nombreUsuario,
      mensaje: nuevoMensaje
    });
  }
  return (
    <div className="App">
      <div className='mensaje'>
        <h3>Nombre de Usuario: {nombreUsuario}</h3>
        <UlMensajes>
          {mensajes.map(mensaje => (
            <LiMensaje key={mensaje.id}>{mensaje.usuario}: {mensaje.mensaje}</LiMensaje>
          ))}
        </UlMensajes>
      </div>
      <form className='login' onSubmit={handleEnviar}>
        <img className='logo' src={logo} alt="Logo de perfil" />
        <input
          className='input'
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          value={nombreUsuario}
          onChange={e => setNombreUsuario(e.target.value)}
        />
        <br />
        <input
          className='input'
          type="text"
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
        />
        <br />
        <button className='boton' onClick={enviarMensaje} >Enviar</button>
      </form>
    </div>
  );

}

export default App;
