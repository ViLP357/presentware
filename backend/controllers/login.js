const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  if (!user) {
    return response.status(404).json({
      error: 'username not found'
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )


  response
    .status(200)
    .send({
      token,
      id: user._id,
      username: user.username,
      role: user.role,
      country: user.country,
      projects: user.projects,
      links: user.links && !Array.isArray(user.links) ? user.links : {},
    })
})

module.exports = loginRouter