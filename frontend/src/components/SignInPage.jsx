import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import userService from '../services/users'

const SignInPage = ({ user, onLogin }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState(location.state?.username ?? '')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await userService.create({ username, password })
      const loggedInUser = await loginService.login({ username, password })
      onLogin(loggedInUser)
      navigate('/home')
    } catch (error) {
      console.error('Account creation failed:', error)
      setErrorMessage(
        error.response?.status === 400
          ? 'Käyttäjätunnus on jo käytössä tai tiedot eivät kelpaa.'
          : 'Tilin luonti epäonnistui. Tarkista, että backend on käynnissä.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user) {
    return (
      <div>
        <h2>You are alreasy logged in</h2>
        <Link to="/home">Continue to Home-page</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>Create a user</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-username">Username</label>
          <input
            id="new-username"
            autoComplete="username"
            required
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="new-password">Password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? ' Creating an account...' : 'Create an account'}
        </button>
      </form>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <p>
        Do you have an account? <Link to="/">Sign in</Link>
      </p>
    </div>
  )
}

export default SignInPage
