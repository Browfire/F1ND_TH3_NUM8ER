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
    rooms.set(roomId, { messages: [], users: 0 }); // Crea una nueva sala con contador de usuarios
    res.json({ roomId });
});

// Ruta para verificar si una sala existe
app.get('/check-room/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    if (rooms.has(roomId)) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
});

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    // Unirse a una sala
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        const room = rooms.get(roomId);
        if (room) {
            room.users += 1; // Incrementar el contador de usuarios
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

    // Salir de la sala
    socket.on('leave-room', (roomId) => {
        const room = rooms.get(roomId);
        if (room) {
            room.users -= 1; // Decrementar el contador de usuarios
            if (room.users === 0) {
                rooms.delete(roomId); // Eliminar la sala si no hay usuarios
                console.log(`Sala ${roomId} eliminada porque no tiene usuarios.`);
            }
        }
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado:', socket.id);
        // Aquí puedes agregar lógica para manejar la desconexión de salas si es necesario
    });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});