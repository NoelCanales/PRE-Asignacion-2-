// Importamos la biblioteca Express
const express = require("express");

// Creamos un router de Express
const router = express.Router();

// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");


// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

//! Segun la capital ---Listar el nombre del país al que pertenece.

// Se define una ruta para buscar un país por su capital
router.get("/country/:capital", (req, res) => {
  // Se busca el país cuya capital coincide con la que se envía en la petición
  const country = Object.values(data.dataLibrary.countries).find(c => c.capital == req.params.capital);

  // Si no se encuentra ningún país, devolvemos un mensaje de error
  if (!country) {
    return res.status(404).send("No se encontró el país con la capital");
  }

  // Si se encuentra el país, creamos un objeto de respuesta con el nombre del país
  const response = {
    service: "country",
    architecture: "microservicios",
    Pais: country.name,
  };

  // Enviamos la respuesta al cliente
  return res.send(response);
});





// Exportamos el router
module.exports = router;
