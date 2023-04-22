const express = require("express"); // importa Express
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library

const logger = (message) => console.log(`Author Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});


//! Listar todos los libros escritos por un autor buscando por: nombre 
// Este endpoint recupera todos los libros escritos por un autor específico basado en su nombre.
router.get("/nameAuthor/:author", async (req, res) => {

  // Construir la ruta de la API para recuperar la información del autor basada en su nombre.
  const ruta = "http://authors:3000/api/v2/authors/author/" + req.params.author;

  // Realizar una solicitud al servicio de autores para obtener el nombre y el ID del autor.
  const name = await fetch(ruta);
  const nameJson = await name.json();

  // Si no se encuentra ningún autor, devolver un mensaje de error.
  if (!nameJson.data || nameJson.data.length === 0) {
    return res.status(404).send({
      error: `NO se ha encontrado el autor con el nombre : "${req.params.author}"`,
    });
  }

  // Filtrar los libros del autor utilizando su ID y crear una lista de títulos.
  const filtrarlibros = data.dataLibrary.books.filter((Libro) => {
    return Libro.authorid == nameJson.data[0].id;
  });
  const libros = filtrarlibros.map(book => {
    return { title: book.title };
  });

  // Crear una respuesta con la información del servicio y los libros del autor.
  const response = {
    service: "books",
    architecture: "microservices",
    length: libros.length,
    author: nameJson.data[0].author,
    data: libros,
  };

  // Enviar la respuesta al cliente.
  return res.send(response);
});


//!Listar todos los libros escritos por un autor buscando por id
// Esta ruta maneja las solicitudes GET que contienen un parámetro de ruta ":id" que representa el ID de un autor.
router.get("/author/:id", async (req, res) => {
  // Se construye una URL para llamar a la API de autores utilizando el ID proporcionado.
  const ruta = `http://authors:3000/api/v2/authors/${req.params.id}`;
  // Se realiza una solicitud HTTP para obtener los detalles del autor a partir del ID proporcionado.
  const name = await fetch(ruta);
  // Se convierte la respuesta en formato JSON.
  const nameJson = await name.json();

  // Si no se encuentra un autor con el ID proporcionado, se devuelve un mensaje de error 404.
  if (!nameJson.data || nameJson.data.length === 0) {
    return res.status(404).send({
      error: `No se ha encontrado el autor con el ID: "${req.params.id}"`,
    });
  }

  // Filtra la lista de libros utilizando el ID del autor.
  const libros = data.dataLibrary.books.filter((Libro) => {
    return Libro.authorid == nameJson.data[0].id;
  });

  // Construye una respuesta JSON con los detalles de los libros del autor.
  const response = {
    service: "books",
    architecture: "microservices",
    length: libros.length,
    author: nameJson.data[0].author,
    data: libros,
  };
  // Envía la respuesta al cliente.
  return res.send(response);
});


//** Listar los libros por rango de fecha 

//!Libros entre 1900 y 1930
// ruta para la solicitud GET
router.get('/books1', (req, res) => {

  // Definir el rango de años para filtrar los libros
  const añorinicial = 1900;
  const añofinal = 1930;

  // Filtrar los libros según el rango de años
  const filtrarLibros = data.dataLibrary.books.filter(book => book.year >= añorinicial && book.year <= añofinal);

  // Mapear los libros filtrados para obtener solo el título y el año de publicación
  const books = filtrarLibros.map(book => {
    return { title: book.title, year: book.year };
  });

  // Crear un objeto de respuesta con la información de los libros filtrados
  const response = {
    servicio: "books",
    arquitectura: "microservices",
    cantidadLibros: books.length,
    informacion: books,
  };

  // Enviar la respuesta al cliente
  return res.send(response);
});  


//!Libros mayores o igual al año 1900
router.get('/books2', (req, res) => {

  // Filtrar los libros de la biblioteca que se publicaron a partir del año 1900
  const filtrarLibros = data.dataLibrary.books.filter(book => book.year >= 1900);

  // Mapear los libros filtrados para obtener solo el título y el año de publicación
  const books = filtrarLibros.map(book => {
    return { title: book.title, year: book.year };
  });

  // Crear un objeto de respuesta con la información de los libros filtrados
  const response = {
    servicio: "books",
    arquitectura: "microservices",
    cantidadLibros: books.length,
    informacion: books,
  };

  // Enviar la respuesta al cliente
  return res.send(response);
});


//! Libros menores o igual al año 1900
router.get('/books3', (req, res) => {

  // Filtrar los libros de la biblioteca que se publicaron antes del año 1900
  const filtrarLibros = data.dataLibrary.books.filter(book => book.year <= 1900);

  // Mapear los libros filtrados para obtener solo el título y el año de publicación
  const books = filtrarLibros.map(book => {
    return { title: book.title, year: book.year };
  });

  // Crear un objeto de respuesta con la información de los libros filtrados
  const response = {
    servicio: "books",
    arquitectura: "microservices",
    cantidadLibros: books.length,
    informacion: books,
  };

  // Enviar la respuesta al cliente
  return res.send(response);
});

//! Libros iguales año 1900

router.get('/books4', (req, res) => {

  // Filtrar los libros de la biblioteca que se publicaron en el año 1900
  const filtrarLibros = data.dataLibrary.books.filter(book => book.year === 1900);

  // Si no se encontraron libros con el año especificado, enviar una respuesta de error con un mensaje
  if (filtrarLibros.length === 0) {
    return res.status(404).send({ mensaje: 'No se encontraron libros con el año especificado.' });
  }

  // Mapear los libros filtrados para obtener solo el título y el año de publicación
  const books = filtrarLibros.map(book => {
    return { title: book.title, year: book.year };
  });

  // Crear un objeto de respuesta con la información de los libros filtrados
  const response = {
    servicio: "books",
    arquitectura: "microservices",
    cantidadLibros: books.length,
    informacion: books,
  };

  // Enviar la respuesta al cliente
  return res.send(response);
});


module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
