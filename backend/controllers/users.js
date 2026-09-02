
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', (request, response) => {
  User.find({}).then(users=> {
    response.json(users)
  })
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

module.exports = usersRouter