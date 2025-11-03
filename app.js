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

function escribirLibros(libros) {
  fs.writeFileSync(DB_PATH, JSON.stringify(libros, null, 2), 'utf-8');
}

function validarLibroPut(payload) {
  const errores = [];

  if (!payload || typeof payload !== 'object') {
    errores.push('Cuerpo inválido o ausente.');
    return errores;
  }

  if (typeof payload.titulo !== 'string' || payload.titulo.trim() === '') {
    errores.push('titulo es requerido (string no vacío).');
  }
  if (typeof payload.autor !== 'string' || payload.autor.trim() === '') {
    errores.push('autor es requerido (string no vacío).');
  }
  if (typeof payload.genero !== 'string' || payload.genero.trim() === '') {
    errores.push('genero es requerido (string no vacío).');
  }
  if (typeof payload.anioPublicacion !== 'number' || !Number.isInteger(payload.anioPublicacion)) {
    errores.push('anioPublicacion es requerido (entero).');
  }

  return errores;
}

app.put('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un entero positivo.' });
  }

    const errores = validarLibroPut(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Validación fallida.', detalles: errores });
  }

    const libros = leerLibros();

    const idx = libros.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: `No existe libro con id ${id}.` });
  }

    const libroActualizado = {
    id,
    titulo: req.body.titulo.trim(),
    autor: req.body.autor.trim(),
    genero: req.body.genero.trim(),
    anioPublicacion: req.body.anioPublicacion
  };

libros[idx] = libroActualizado;
  try {
    escribirLibros(libros);
  } catch (e) {
    console.error('Error al escribir books.json:', e.message);
    return res.status(500).json({ error: 'No se pudo guardar el libro. Intenta de nuevo.' });
  }

return res.status(200).json(libroActualizado);

});

app.listen (PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}) 