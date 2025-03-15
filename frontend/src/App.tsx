import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Conectar al servidor backend

function App() {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  // Unirse a una sala
  const joinRoom = () => {
    if (roomId) {
      socket.emit('join-room', roomId); // Enviar el código de la sala al backend
    }
  };

  // Escuchar mensajes entrantes
  useEffect(() => {
    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]); // Agregar el mensaje al historial
    });

    socket.on('chat-history', (history) => {
      setMessages(history); // Cargar el historial de mensajes al unirse
    });

    return () => {
      socket.off('receive-message');
      socket.off('chat-history');
    };
  }, []);

  // Enviar un mensaje
  const sendMessage = () => {
    if (message && roomId) {
      socket.emit('send-message', roomId, message); // Enviar el mensaje a la sala
      setMessage(''); // Limpiar el campo de texto
    }
  };

  return (
    <div>
      <h1>Chat en tiempo real</h1>
      <div>
        <input
          type="text"
          placeholder="Código de sala"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Unirse a sala</button>
      </div>
      <div>
        <h2>Mensajes:</h2>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Escribe un mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default App;