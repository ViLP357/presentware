
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const dns = require('dns')
dns.setServers(['1.1.1.1'])
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: String,
  link: String,
  type: String,
  content: String,
  image: String,
  created_at: { type: Date, default: Date.now },
  used_time: { type: Number, default: 0 },
  ai_usage: { type: Number, default: 0 },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String
  }],
  links: [{
    type: String
  }]
})

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Project', projectSchema)