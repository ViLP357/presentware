const express = require('express')
const app = express()
app.use(express.json())

let projects = [
  {
    id: "1",
    title: "TEst prjects",
    creator: "Tester",
    link: "none",
    type: "software"
  },  {
    id: "2",
    title: "TEst prject2",
    creator: "Tester2",
    link: "none",
    type: "software"
  },
    {
    id: "3",
    title: "TEst prject3",
    creator: "Tester3",
    link: "hello",
    type: "hardware"
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/projects', (request, response) => {
  response.json(projects)
})

app.get('/api/projects/:id', (request, response) => {
    const id = request.params.id;
    const project = projects.find(p => p.id === id) 
    if (project) {
        response.json(project)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/projects/:id', (request, response) => {
  const id = request.params.id
  project = projects.filter(p => p.id !== id)

  response.status(204).end()
})
const generateId = () => {
  const maxId = projects.length > 0
    ? Math.max(...projects.map(p => Number(p.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/projects', (request, response) => {

    const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

    const project = {
    id: generateId(),
    title:body.title,
    creator: body.creator,
    link: body.link,
    type: body.type
  }
    console.log(project)

    projects = projects.concat(project)
    response.json(project)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})