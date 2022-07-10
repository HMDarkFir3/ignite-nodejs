const express = require("express");

const app = express();

app.use(express.json());

//Server running in localhost:3333

/**
 * Tipos de Parâmetros
 *
 * Routes Params - parâmetro que ficará na rota (url) -
 * Pode ser utilizado para editar/deletar/buscar
 *
 * Query Params - Paginaçao/Filtro
 *
 * Body Params - Inserção/alteração (JSON)
 */

app.get("/courses", (req, res) => {
  const query = req.query;

  console.log(query);

  return res.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/courses", (req, res) => {
  const body = req.body;

  console.log(body);

  return res.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/courses/:id", (req, res) => {
  const { id } = req.params;

  return res.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"]);
});

app.patch("/courses/:id", (req, res) => {
  return res.json(["Curso 6", "Curso 2", "Curso 5", "Curso 4"]);
});

app.delete("/courses/:id", (req, res) => {
  return res.json(["Curso 6", "Curso 5", "Curso 4"]);
});

app.listen(3333);
