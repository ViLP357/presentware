require('dotenv').config()
const express = require('express')
const Project = require('./models/project')
const app = express()



const logger = require('./utils/logger')
const config = require('./utils/config')


logger.info(`Server running on port ${config.PORT}`)

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


app.use(express.json())
app.use(requestLogger)



let projects = []
let users = []

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/projects', (request, response) => {
  Project.find({}).then(projects=> {
    response.json(projects)
  })
})

app.get('/api/projects/:id', (request, response) => {
    Project.findById(request.params.id).then((project) => {
      response.json(project)
    })
})

app.delete('/api/projects/:id', (request, response) => {
  const id = request.params.id
  project = projects.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/projects', (request, response) => {
    const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  const project = new Project({
    title: body.title,
  })
  project.save().then((savedProject)=> {
    response.json(savedProject)
  })
})

app.get('/api/users', (request, response) => {
  response.json(users)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})