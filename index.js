const express = require('express');
const app = express();
const port = 3000;

app.get('/saludo', (req, res) => {
  // Código vulnerable: inyecta directamente el parámetro en HTML sin filtrar
  res.send(`<h1>Bienvenido ${req.query.nombre}</h1>`);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
