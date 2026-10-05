
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('projects', { title: 1, type: 1 })
  
  response.json(users)
})
usersRouter.get('/:id', (request, response, next)=> {
    User.findById(request.params.id).then((user)=> {
    response.json(user)
  })
  .catch(error=>next(error))
})

usersRouter.delete('/:id', (request, response, next) => {
  User.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

usersRouter.post('/', async (request, response) => {
  const { username, password, country, links = {} } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'Username or password missing'
    })
  }

  if (
    links === null ||
    typeof links !== 'object' ||
    Array.isArray(links) ||
    Object.values(links).some(link => typeof link !== 'string')
  ) {
    return response.status(400).json({
      error: 'Links must be an object with string values'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    country,
    links
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})
usersRouter.put('/:id', async (request, response, next) => {
  try {
    const authorization = request.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(
      authorization.replace('Bearer ', ''),
      process.env.SECRET
    )
    if (decodedToken.id !== request.params.id) {
      return response.status(403).json({ error: 'cannot edit another user' })
    }

    const { links } = request.body
    if (
      links === null ||
      typeof links !== 'object' ||
      Array.isArray(links) ||
      Object.entries(links).some(([name, link]) =>
        !name.trim() || typeof link !== 'string' || !link.trim()
      )
    ) {
      return response.status(400).json({
        error: 'Links must be an object with non-empty names and string values'
      })
    }

    const user = await User.findById(request.params.id)
    if (!user) {
      return response.status(404).end()
    }

    user.links = links
    user.markModified('links')
    const updatedUser = await user.save()
    response.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter