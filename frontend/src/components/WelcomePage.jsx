import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import LoginForm from './LoginForm'

const WelcomePage = ({ user, onLogin }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const loggedInUser = await loginService.login({ username, password })
      onLogin(loggedInUser)
      setUsername('')
      setPassword('')
      navigate('/home')
    } catch (error) {
      console.error('Login failed:', error)
      if (error.response?.status === 404) {
        navigate('/sign-in', { state: { username } })
      } else {
        setErrorMessage(
          error.response?.status === 401
            ? 'Virheellinen salasana.'
            : 'Kirjautuminen epäonnistui. Tarkista, että backend on käynnissä.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Welcome</h2>
      {user ? (
        <p>
          Logged in as {user.username}.{' '}
          <Link to="/profile">Your profile</Link>
        </p>
      ) : (
        <LoginForm
          handleSubmit={handleSubmit}
          handleUsernameChange={event => setUsername(event.target.value)}
          handlePasswordChange={event => setPassword(event.target.value)}
          username={username}
          password={password}
          isSubmitting={isSubmitting}
        />
      )}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  )
}

export default WelcomePage
