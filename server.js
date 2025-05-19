const express = require("express");
const cors = require("cors");
const app = express();

// Configuración CORRECTA de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://sitio-fitness.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para JSON
app.use(express.json());

// Rutas
app.get("/", (req, res) => res.send("API FitnessPro"));

// Importación y uso de rutas
const routes = [
  { path: "/usuarios", router: require("./routes/usuariosRoutes") },
  { path: "/gimnasios", router: require("./routes/gymRoutes") },
  { path: "/entrenadores", router: require("./routes/entrenadorRoutes") },
  { path: "/citas", router: require("./routes/citasRoutes") },
  { path: "/auth", router: require("./routes/autenticacionRoutes") },
  { path: "/solicitudes", router: require("./routes/solicitudesRoutes") },
  { path: "/videos", router: require("./routes/videosRoutes") }
];

routes.forEach(route => app.use(route.path, route.router));

// Inicio del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en puerto ${port}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend permitido: ${process.env.FRONTEND_URL || 'https://sitio-fitness.onrender.com'}`);
});