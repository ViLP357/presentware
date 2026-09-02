
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

usersRouter.get('/:id', (request, response) => {
  User.findByIdAndDelete(request.params.id)
  .then(result=>{response.status(204).end()})
})

usersRouter.post('/', (request, response) => {
  const body = request.body
  if (!body.username ||!body.password) {
    return response.status(400).json({ 
      error: 'Username or password missing' 
    })
  }
  const user = new User({
    username: body.username,
    password: body.password
  })
  user.save().then((savedUser)=> {
    response.json(savedUser)
  })
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