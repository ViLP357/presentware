import axios from 'axios'
import loginService from './login'

const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const token = loginService.getToken()
  if (!token) {
    throw new Error('You must be logged in to update a user')
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

const remove = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, getById, create, update, remove }
