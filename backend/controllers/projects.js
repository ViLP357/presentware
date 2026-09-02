const projectsRouter = require('express').Router()
const Project = require('../models/project')

projectsRouter.get('/', (request, response) => {
  Project.find({}).then(projects=> {
    response.json(projects)
  })
})

projectsRouter.get('/:id', (request, response) => {
    Project.findById(request.params.id).then((project) => {
      response.json(project)
    })
})

projectsRouter.delete('/:id', (request, response, next) => {
  Project.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error=>next(error))
})
projectsRouter.put('/:id', (request, response,next)=> {
  const {title} = request.body
  Project.findById(request.params.id)
  .then(project=> {
    if (!project) {
      return response.status(404).end()
    }
    project.title = title

    return project.save().then((updatedProject)=> {
      response.json(updatedProject)
    })
  })
  .catch(error=>next(error))
})

projectsRouter.post('/', (request, response) => {
    const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  const project = new Project({
    title: body.title,
    creator: body.creator,
    link: body.link,
    type: body.type,
    description: body.description
  })
  project.save().then((savedProject)=> {
    response.json(savedProject)
  })
})
module.exports = projectsRouter