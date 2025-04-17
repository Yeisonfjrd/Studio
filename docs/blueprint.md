# **App Name**: TaskMaster

## Core Features:

- Kanban Board: Display tasks in a clear, column-based layout (To Do, In Progress, Done).
- Drag and Drop Functionality: Allow users to drag and drop tasks between columns to update their status.
- Task Creation Form: Provide a simple form for users to quickly add new tasks with a title, description, and initial status.
- Task Editing: Enable users to edit existing tasks to update their title, description, or status.
- AI-Powered Task Tagging: Use an AI model to intelligently suggest relevant tags for each task based on its title and description. The LLM will act as a tool to decide when a tag is relevant or not.

## Style Guidelines:

- Primary color: A calming blue (#3498db) for headers and main sections.
- Secondary color: A clean white (#ffffff) for backgrounds and task cards.
- Accent: A vibrant green (#2ecc71) to indicate successful task completion or positive actions.
- Neutral color: Light grey (#f2f2f2) for dividing lines and subtle UI elements.
- Use a clear, column-based layout with well-defined sections for 'To Do', 'In Progress', and 'Done' tasks.
- Ensure the design is responsive and adapts well to different screen sizes (desktop, tablet, mobile).
- Use simple, intuitive icons to represent task status and actions (e.g., a checkmark for 'Done', a pencil for 'Edit').
- Incorporate smooth transitions when dragging and dropping tasks between columns.

## Original User Request:
Detalles Específicos del Proyecto: Sistema de Gestión de Tareas
Funcionalidades Requeridas
El sistema debe ser una aplicación tipo Trello, con las siguientes características:

Gestión de Tareas (CRUD):
Los usuarios deben poder crear, leer, actualizar y eliminar tareas.
Cada tarea debe tener: título, descripción, estado (por ejemplo, "To Do", "In Progress", "Done"), fecha de creación, y asignado (usuario o equipo).
Interfaz con columnas para arrastrar y soltar tareas entre estados (drag-and-drop).
Autenticación:
Los usuarios deben registrarse e iniciar sesión para acceder a sus tareas.
Usa Clerk para autenticación, ya que tienes experiencia con esta herramienta.
Gestión de Equipos:
Los usuarios deben poder crear equipos y asignar tareas a miembros del equipo.
Cada usuario puede ver las tareas asignadas a ellos o a su equipo.
Notificaciones:
Implementa notificaciones cuando una tarea se asigna a un usuario o cambia de estado.
Usa Nodemailer para enviar notificaciones por email (por ejemplo, "Te han asignado una nueva tarea").
Interfaz de Usuario (UI):
Usa React o Next.js para el frontend.
Implementa drag-and-drop con una librería como react-beautiful-dnd para mover tareas entre columnas.
Diseño responsive y moderno, con un tema claro/oscuro opcional.
Backend y Base de Datos:
Usa Node.js y Express para crear una API REST que maneje las operaciones CRUD.
Usa MongoDB (con Mongoose) o PostgreSQL (con Prisma) para almacenar tareas, usuarios y equipos.
Estructura de datos:
Tareas: id, título, descripción, estado, asignado (id de usuario o equipo), fecha de creación.
Usuarios: id, email, nombre, equipos (array de ids).
Equipos: id, nombre, miembros (array de ids de usuarios).
Testing:
Pruebas unitarias para el backend con Jest (por ejemplo, probar las rutas de la API).
Pruebas de integración para el frontend con Cypress (por ejemplo, probar el flujo de crear una tarea).
CI/CD:
Configura un pipeline con GitHub Actions para:
Ejecutar pruebas automáticamente en cada push.
Desplegar el frontend a Vercel y el backend a un servicio como Render si las pruebas pasan.
Documentación:
Un README detallado con:
Descripción del proyecto.
Tecnologías usadas.
Instrucciones para instalar y ejecutar localmente (frontend y backend).
Ejemplos de uso con capturas de pantalla.
Explicación del pipeline de CI/CD y las pruebas.
Enlace a la app desplegada.
Tecnologías a Usar
Frontend: React (o Next.js), TypeScript, react-beautiful-dnd, Tailwind CSS (para estilos).
Backend: Node.js, Express, TypeScript, MongoDB (con Mongoose) o PostgreSQL (con Prisma).
Autenticación: Clerk.
Notificaciones: Nodemailer.
Testing: Jest (backend), Cypress (frontend).
CI/CD: GitHub Actions, Vercel (frontend), Render (backend).
Otros: Git para control de versiones, GitHub para el repositorio.
Habilidades que Demostrarás
Desarrollo full-stack con tecnologías modernas.
Manejo de bases de datos y autenticación.
Implementación de CI/CD y testing automatizado.
Colaboración (si invitas a otros a contribuir).
Documentación profesional.
Paso a Paso para Empezar el Proyecto
Vamos a dividir el proceso en pasos claros para que puedas empezar desde cero. Comenzaremos configurando el entorno, creando el repositorio, y desarrollando las bases del frontend y backend. Luego, añadiremos las funcionalidades más avanzadas como autenticación, notificaciones, testing y CI/CD.

Paso 1: Configura el Entorno y Crea el Repositorio
Crea un Repositorio en GitHub:
Ve a GitHub y crea un nuevo repositorio llamado task-management-system.
Marca la opción de incluir un README inicial.
Añade un .gitignore para Node.js (puedes usar la plantilla de GitHub).
Clona el Repositorio Localmente:
Abre tu terminal (en WSL si estás en Windows) y clona el repositorio:
bash

Collapse

Wrap

Copy
git clone https://github.com/Yeisonfjrd/task-management-system.git
cd task-management-system
Crea una Estructura de Carpetas:
Dentro del directorio task-management-system, crea dos carpetas: frontend y backend.
bash

Collapse

Wrap

Copy
mkdir frontend backend
Instala las Dependencias Necesarias:
Asegúrate de tener Node.js instalado (versión 20.x, como usaste en proyectos anteriores).
Instala un editor de código como VS Code o Windsurf (que ya configuraste).
Paso 2: Configura el Backend
Vamos a empezar con el backend, ya que será la base para manejar las operaciones CRUD y la autenticación.

Inicializa el Proyecto Backend:
Ve a la carpeta backend:
bash

Collapse

Wrap

Copy
cd backend
npm init -y
Instala las dependencias iniciales:
bash

Collapse

Wrap

Copy
npm install express typescript @types/express @types/node ts-node-dev mongoose dotenv
Configura TypeScript:
bash

Collapse

Wrap

Copy
npx tsc --init
Edita el archivo tsconfig.json para incluir:
json

Collapse

Wrap

Copy
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
Configura MongoDB:
Crea una cuenta en MongoDB Atlas (https://www.mongodb.com/cloud/atlas) y crea un nuevo clúster.
Obtén la URI de conexión (por ejemplo, mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/taskdb?retryWrites=true&w=majority).
Crea un archivo .env en la carpeta backend:
env

Collapse

Wrap

Copy
MONGODB_URI=mongodb+srv://<tu-usuario>:<tu-contraseña>@cluster0.mongodb.net/taskdb?retryWrites=true&w=majority
PORT=5000
Crea el Servidor Básico:
Crea un archivo src/index.ts:
typescript

Collapse

Wrap

Copy
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('¡API de Gestión de Tareas funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
Añade un script en package.json para ejecutar el servidor:
json

Collapse

Wrap

Copy
"scripts": {
  "start": "ts-node-dev --respawn --transpile-only src/index.ts"
}
Prueba el Servidor:
Ejecuta el servidor:
bash

Collapse

Wrap

Copy
npm start
Abre tu navegador o usa Postman para visitar http://localhost:5000. Deberías ver "¡API de Gestión de Tareas funcionando!".
Paso 3: Configura el Frontend
Ahora configuraremos el frontend con React y TypeScript.

Inicializa el Proyecto Frontend:
Ve a la carpeta frontend:
bash

Collapse

Wrap

Copy
cd ../frontend
npx create-react-app . --template typescript
Instala dependencias adicionales:
bash

Collapse

Wrap

Copy
npm install axios react-beautiful-dnd tailwindcss @tailwindcss/vite @clerk/clerk-react
Configura Tailwind CSS:
Inicializa Tailwind:
bash

Collapse

Wrap

Copy
npx tailwindcss init
Edita tailwind.config.js:
javascript

Collapse

Wrap

Copy
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
Crea un archivo src/index.css:
css

Collapse

Wrap

Copy
@tailwind base;
@tailwind components;
@tailwind utilities;
Configura Clerk para Autenticación:
Crea una cuenta en Clerk (https://clerk.com) y obtén tu clave API.
Crea un archivo .env en la carpeta frontend:
env

Collapse

Wrap

Copy
REACT_APP_CLERK_PUBLISHABLE_KEY=tu-clave-de-clerk
Edita src/App.tsx para incluir Clerk:
tsx

Collapse

Wrap

Copy
import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <h1 className="text-3xl font-bold text-center mt-10">
                    Bienvenido al Sistema de Gestión de Tareas
                  </h1>
                </SignedIn>
                <SignedOut>
                  <div className="flex justify-center mt-10">
                    <SignIn />
                  </div>
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
Prueba el Frontend:
Ejecuta el frontend:
bash

Collapse

Wrap

Copy
npm start
Abre http://localhost:3000 en tu navegador. Deberías ver la pantalla de inicio de sesión de Clerk. Regístrate o inicia sesión para ver el mensaje de bienvenida.
Paso 4: Define el Modelo de Datos y Crea la API
Crea el Modelo de Tareas:
En backend/src/models, crea un archivo Task.ts:
typescript

Collapse

Wrap

Copy
import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignedTo: { type: String }, // ID del usuario o equipo
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Task', TaskSchema);
Crea Rutas para Tareas:
En backend/src/routes, crea un archivo taskRoutes.ts:
typescript

Collapse

Wrap

Copy
import express from 'express';
import Task from '../models/Task';

const router = express.Router();

// Crear una tarea
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la tarea' });
  }
});

// Obtener todas las tareas
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Actualizar una tarea
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;
Conecta las Rutas al Servidor:
Edita backend/src/index.ts para incluir las rutas:
typescript

Collapse

Wrap

Copy
import taskRoutes from './routes/taskRoutes';

app.use('/api/tasks', taskRoutes);
Prueba la API:
Reinicia el servidor (npm start) y usa Postman para probar:
POST http://localhost:5000/api/tasks con un cuerpo como:
json

Collapse

Wrap

Copy
{
  "title": "Hacer la compra",
  "description": "Comprar leche y pan",
  "status": "To Do",
  "assignedTo": "user123"
}
GET http://localhost:5000/api/tasks para ver todas las tareas.
Paso 5: Conecta el Frontend con el Backend
Crea un Componente para Mostrar Tareas:
En frontend/src, crea un archivo Tasks.tsx:
tsx

Collapse

Wrap

Copy
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  createdAt: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tareas</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="border p-2 mb-2">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Estado: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
Actualiza App.tsx para Incluir el Componente:
Edita App.tsx:
tsx

Collapse

Wrap

Copy
import Tasks from './Tasks';

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Tasks />
                </SignedIn>
                <SignedOut>
                  <div className="flex justify-center mt-10">
                    <SignIn />
                  </div>
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}
Prueba la Conexión:
Asegúrate de que el backend esté corriendo (npm start en la carpeta backend).
Inicia el frontend (npm start en la carpeta frontend).
Inicia sesión con Clerk y verifica que las tareas se muestren en la interfaz.
Próximos Pasos
Ahora que tienes una base funcional, los siguientes pasos serán:

Añadir Drag-and-Drop: Usa react-beautiful-dnd para permitir mover tareas entre columnas ("To Do", "In Progress", "Done").
Implementar Autenticación Completa: Usa Clerk para asignar tareas a usuarios autenticados.
Añadir Notificaciones: Configura Nodemailer para enviar emails cuando se asignen tareas.
Escribir Pruebas: Usa Jest para el backend y Cypress para el frontend.
Configurar CI/CD: Crea un pipeline con GitHub Actions para pruebas y despliegue.
Documentar el Proyecto: Escribe un README detallado.
  