const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { nanoid } = require('nanoid');
const cors = require('cors'); // Importar el paquete cors

const app = express();
const server = http.createServer(app);

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solicitudes desde el frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    credentials: true // Permitir credenciales (si las usas)
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Permitir conexiones WebSocket desde el frontend
        methods: ['GET', 'POST'],
    },
});

// Almacenar salas y sus mensajes
const rooms = new Map();

// Ruta para crear una sala
app.get('/create-room', (req, res) => {
    const roomId = nanoid(6); // Genera un código de 6 caracteres
    rooms.set(roomId, { messages: [] }); // Crea una nueva sala
    res.json({ roomId });
});

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    // Unirse a una sala
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        const room = rooms.get(roomId);
        if (room) {
            // Enviar historial de mensajes al usuario que se une
            socket.emit('chat-history', room.messages);
        }
    });

    // Enviar un mensaje a la sala
    socket.on('send-message', (roomId, message) => {
        const room = rooms.get(roomId);
        if (room) {
            room.messages.push(message); // Guardar el mensaje en la sala
            io.to(roomId).emit('receive-message', message); // Enviar el mensaje a todos en la sala
        }
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado:', socket.id);
    });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});