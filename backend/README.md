# Backend del Proyecto de Chat en Tiempo Real

Este es el backend de una aplicación de chat en tiempo real. Permite a los usuarios crear salas, unirse a salas existentes y enviar mensajes en tiempo real.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para construir APIs RESTful.
- **Socket.IO**: Librería para manejar conexiones en tiempo real.
- **nanoid**: Generador de códigos únicos para las salas.
- **CORS**: Middleware para permitir solicitudes desde el frontend.

## Estructura del proyecto

```
backend/
├── src/
│   ├── server.js       # Archivo principal del servidor
├── package.json        # Dependencias y scripts del proyecto
├── .gitignore          # Archivos y carpetas ignorados por Git
```

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Browfire/F1ND_TH3_NUM8ER.git
   ```

2. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`.

## Endpoints

- **Crear una sala**:
  ```
  GET /create-room
  ```

  Devuelve un código de sala único.