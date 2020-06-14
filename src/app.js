const express = require("express");
const { uuid, isUuid } = require('uuidv4')
const cors = require("cors");

const app = express();

app.use(express.json()); //o use serve para adicionar algum tipo de função onde todas as rotas irao passar por elas
app.use(cors());

const repositories = []; 
// enquanto a aplicação estiver sendo executada as informações definidas na constante estarão disponíveis para todo o projeto.
// não é pra ser usado em produção

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log("logRequests -> logLabel", logLabel)
  return next();
}

function validateProjectId(request, response, next) {
  const {id} = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({error: 'invalid project ID'})
  }

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validateProjectId) //o middleware so sera aplicado nas rotas com parametro :id e podemos colocar quanto forem necessarios

app.get("/repositories", (request, response) => {
// const query = request.query; // o que esta dentro são os parametros que serão enviados pela url
// const { title } = request.query; 
 
 /* const results = title 
 ? repositories.filter(rep => rep.title.includes(title))
 : repositories */

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( p => p.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository // sabendo o indice, substituimos os dados andigos pelo atual

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex( p => p.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1) // sabendo o indice, substituimos os dados andigos pelo atual

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex( p => p.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories[repositoryIndex].likes++

  var repository = repositories[repositoryIndex]
  
  return response.json(repository)

});

module.exports = app;
