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

app.delete('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);

  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  
  let libros;
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    libros = JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error al leer books.json:', err.message);
    return res.status(500).json({ error: 'No se pudo leer la base de datos.' });
  }

  
  const index = libros.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `No existe libro con ID ${id}.` });
  }

  
  const [libroEliminado] = libros.splice(index, 1);

  
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(libros, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escribir books.json:', err.message);
    return res.status(500).json({ error: 'No se pudo guardar la base de datos.' });
  }

  console.log(`Libro con ID ${id} eliminado correctamente.`);

  
  res.status(200).json({
    message: `Libro con ID ${id} eliminado correctamente.`,
    data: libroEliminado
  });
});


app.listen (PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}) 