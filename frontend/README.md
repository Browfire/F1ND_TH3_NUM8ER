# Frontend del Proyecto de Chat en Tiempo Real

Este es el frontend de una aplicación de chat en tiempo real. Permite a los usuarios crear salas, unirse a salas existentes y enviar mensajes en tiempo real.

## Tecnologías utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Lenguaje que añade tipos estáticos a JavaScript.
- **Socket.IO Client**: Librería para manejar conexiones en tiempo real con el backend.
- **Vite**: Herramienta de construcción rápida para proyectos modernos.

## Estructura del proyecto

```
frontend/
├── src/
│   ├── assets/         # Directorio de recursos del proyecto
│   ├── App.tsx         # Componente principal de la aplicación
│   ├── main.tsx        # Punto de entrada de la aplicación
├── package.json        # Dependencias y scripts del proyecto
├── vite.config.ts      # Configuración de Vite
├── .gitignore          # Archivos y carpetas ignorados por Git
```

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Browfire/F1ND_TH3_NUM8ER.git
   ```

2. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`.