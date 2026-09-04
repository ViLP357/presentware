
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', (request, response) => {
  User.find({}).then(users=> {
    response.json(users)
  })
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
  const { username, password, country } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'Username or password missing'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    country
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})
usersRouter.put('/:id', (request, response,next)=> {
  const {username} = request.body
  User.findById(request.params.id)
  .then(user=> {
    if (!user) {
      return response.status(404).end()
    }
    user.username = username

    return user.save().then((updatedUser)=> {
      response.json(updatedUser)
    })
  })
  .catch(error=>next(error))
})

module.exports = usersRouter