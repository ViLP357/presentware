const projectsRouter = require('express').Router()
const Project = require('../models/project')
const User = require('../models/user')

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

projectsRouter.post('/', async(request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  if (!user) {
    return response.status(400).json({error: 'userId missing or not valid'})
  }
  if (!body.title) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const project = new Project({
    title: body.title,
    creator: user._id, //body.creator,
    link: body.link,
    type: body.type,
    content: body.content || body.description,
    image: body.image,
    used_time: Number(body.used_time) || 0,
    ai_usage: Number(body.ai_usage) || 0,
    tags: body.tags || [],
    links: body.links || []
  })

  const savedProject = await project.save()
  user.projects = user.projects.concat(savedProject._id)
  await user.save()
})
module.exports = projectsRouter