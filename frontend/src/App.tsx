import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000'); // Conectar al servidor backend

function App() {
  const [roomId, setRoomId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean | null>(null); // Estado para crear o unirse a una sala
  const [showChat, setShowChat] = useState<boolean>(false); // Estado para mostrar/ocultar el chat

  // Crear una sala
  const createRoom = async () => {
    const response = await fetch('http://localhost:3000/create-room');
    const data = await response.json();
    setRoomId(data.roomId); // Guardar el código de la sala
    setIsCreatingRoom(false); // Ocultar el menú de opciones
    setShowChat(true); // Mostrar el chat
    socket.emit('join-room', data.roomId); // Unirse automáticamente a la sala creada
  };

  // Unirse a una sala existente
  const joinRoom = () => {
    if (roomId) {
      socket.emit('join-room', roomId); // Unirse a la sala
      setIsCreatingRoom(false); // Ocultar el menú de opciones
      setShowChat(true); // Mostrar el chat
    }
  };

  // Escuchar mensajes entrantes
  useEffect(() => {
    socket.on('receive-message', (message: string) => {
      setMessages((prev) => [...prev, message]); // Agregar el mensaje al historial
    });

    socket.on('chat-history', (history: string[]) => {
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

      {/* Menú de opciones (crear o unirse a una sala) */}
      {!showChat && isCreatingRoom === null && (
        <div>
          <button onClick={() => setIsCreatingRoom(true)}>Crear sala</button>
          <button onClick={() => setIsCreatingRoom(false)}>Unirse a sala</button>
        </div>
      )}

      {/* Formulario para crear o unirse a una sala */}
      {!showChat && isCreatingRoom !== null && (
        <div>
          {isCreatingRoom ? (
            <div>
              <button onClick={createRoom}>Crear sala</button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Código de sala"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button onClick={joinRoom}>Unirse a sala</button>
            </div>
          )}
        </div>
      )}

      {/* Mostrar el código de la sala al crear una */}
      {isCreatingRoom && roomId && (
        <div>
          <p>Sala creada con éxito! Código: {roomId}</p>
        </div>
      )}

      {/* Chat */}
      {showChat && (
        <div>
          <h2>Mensajes:</h2>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
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
      )}
    </div>
  );
}

export default App;