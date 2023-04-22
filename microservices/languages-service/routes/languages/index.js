const express = require("express");
const path = require('path');
const router = express.Router();

// Definir la ruta del archivo CSV y unirlo con el directorio actual
const csvPath = '../../data/language-codes.csv';
const directoryPath = path.join(__dirname, csvPath);

const csvtojson = require('csvtojson');


// Creamos un array temporal para almacenar los datos procesados del CSV
const tempArray = [];

// Usamos el método "csvtojson" para leer el archivo CSV y convertirlo en un objeto JSON
csvtojson({
  noheader: true, // Indicamos que el archivo no tiene cabecera
  headers: ['codigo', 'langs'] // Definimos las cabeceras para el objeto JSON resultante
})
  .fromFile(directoryPath) // Leemos el archivo CSV desde la ubicación indicada en "directoryPath"
  .then((jsonObject) => { // Ejecutamos una función cuando la conversión a JSON se complete

    // Recorremos el objeto JSON y dividimos la propiedad "langs" en un array de idiomas
    for (let items in jsonObject) {
      jsonObject[items]['langs'] = jsonObject[items]['langs'].split(";");

      // Añadimos cada elemento del objeto JSON al array temporal
      tempArray.push(jsonObject[items]);
    }
  });




const logger = (message) => console.log(`Languages Service: ${message}`);

//!Mostrar toda la data

router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "languages",
    architecture: "microservices",
    length: tempArray.length,
    data: tempArray,
  };
  logger("Get languages data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});


//! Listar todos los libros escritos por un autor buscando por: nombre 
// Definimos una ruta GET para obtener información de libros en función del código del autor proporcionado
router.get("/languages/:codigo", async (req, res) => {

  // Construimos la ruta para obtener información del autor a partir del código proporcionado
  const ruta = "http://languages:5010/api/v2/languages/codigo" + req.params.codigo;
  const name = await fetch(ruta);
  const nameJson = await name.json();

  // Si no se encuentra información del autor, devolvemos un error 404
  if (!nameJson.data || nameJson.data.length === 0) {
    return res.status(404).send({
      error: `NO se ha encontrado el autor con el nombre : "${req.params.codigo}"`,
    });
  }

  // Filtramos los códigos de los libros que corresponden al autor encontrado anteriormente
  const codigos = tempArray.filter((codigo) => {
    return codigo.authorid == nameJson.data[0].id;
  });

  // Creamos un array de objetos con los títulos de los libros correspondientes a los códigos filtrados anteriormente
  const libros = filtrarlibros.map(book => {
    return { title: book.title };
  });

  // Creamos una respuesta que contiene la información de los libros encontrados y la información del autor encontrado
  const response = {
    service: "books",
    architecture: "microservices",
    length: libros.length,
    author: nameJson.data[0].author,
    data: libros,
  };
  
  // Devolvemos la respuesta como JSON
  return res.send(response);
});




// Exportamos el router
module.exports = router;