import { useCallback, useEffect, useState } from 'react'
import './App.css'
import WelcomePage from './components/WelcomePage'
import HomePage from './components/HomePage'
import ProfilePage from './components/ProfilePage'
import SignInPage from './components/SignInPage'
import loginService from './services/login'

import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleSessionExpired = () => {
      onLogout()
      navigate('/')
    }

    window.addEventListener(loginService.expiredEventName, handleSessionExpired)
    return () => {
      window.removeEventListener(loginService.expiredEventName, handleSessionExpired)
    }
  }, [navigate, onLogout])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const expiresAt = loginService.getExpiration()
    if (!expiresAt) {
      onLogout()
      navigate('/')
      return undefined
    }

    const timeout = window.setTimeout(() => {
      loginService.logout()
      onLogout()
      navigate('/')
    }, Math.max(expiresAt - Date.now(), 0))

    return () => window.clearTimeout(timeout)
  }, [navigate, onLogout, user])

  const handleLogout = () => {
    loginService.logout()
    onLogout()
    navigate('/')
  }

  return (
    <nav>
      <Link to="/">welcome</Link>{' '}
      <Link to="/home">Home</Link>{' '}
      <Link to="/profile">Profile</Link>
      {!user && <> <Link to="/sign-in">Create account</Link></>}
      {user && (
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      )}
    </nav>
  )
}

function App() {
  const [user, setUser] = useState(() => loginService.getLoggedInUser())
  const handleLogout = useCallback(() => setUser(null), [])

  return (
    <div>
      <h1>presentware</h1>
    
   <Router>
    <div>
        <Navigation user={user} onLogout={handleLogout} />

    </div>
    <Routes>
        <Route path="/" element={<WelcomePage user={user} onLogin={setUser} />} />
        <Route path="/sign-in" element={<SignInPage user={user} onLogin={setUser} />} />
        <Route path="/home" element={<HomePage/>} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              user={user}
              onUserUpdate={updatedUser => setUser(updatedUser)}
            />
          }
        />
    </Routes>
   </Router>
      
  </div>
  )
}

export default App
