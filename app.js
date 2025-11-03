const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());


const DB_PATH = path.join(__dirname, 'data', 'books.json');


function leerLibros() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error al leer books.json:', err.message);
    return [];
  }
}

function escribirLibros(libros) {
  fs.writeFileSync(DB_PATH, JSON.stringify(libros, null, 2), 'utf8');
}


app.post('/api/books', (req, res) => {
  const { id, titulo, autor, genero, anioPublicacion } = req.body;

  
  if (!titulo || !autor || !genero || !Number.isInteger(anioPublicacion)) {
    return res.status(400).json({
      error: 'Debes enviar: titulo, autor, genero y anioPublicacion (entero).'
    });
  }

  const libros = leerLibros();

  
  let nuevoId = id;
  if (nuevoId != null) {
    if (!Number.isInteger(nuevoId) || nuevoId <= 0) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo.' });
    }
    if (libros.some(b => b.id === nuevoId)) {
      return res.status(409).json({ error: `Ya existe un libro con id ${nuevoId}.` });
    }
  } else {
    const maxId = libros.length ? Math.max(...libros.map(b => b.id || 0)) : 0;
    nuevoId = maxId + 1;
  }

  
  const nuevoLibro = {
    id: nuevoId,
    titulo: titulo.trim(),
    autor: autor.trim(),
    genero: genero.trim(),
    anioPublicacion
  };

  
  libros.push(nuevoLibro);
  escribirLibros(libros);

  res.status(201).json({
    message: 'Libro agregado correctamente ',
    data: nuevoLibro
  });
});


app.get('/', (req, res) => {
  res.send('Servidor funcionando ');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});