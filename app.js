const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'books.json');

function leerLibros() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error leyendo books.json:', err.message);
    return []; 
  }
}

app.get('/api/books', (req, res) => {
  const libros = leerLibros();
  res.status(200).json(libros);
});

app.get('/', (req, res) => {
  res.send('API de Libros funcionando. Visita /api/books');
});

app.listen (PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}) 