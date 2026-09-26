import './App.css'
import WelcomePage from './components/WelcomePage'
import HomePage from './components/HomePage'
import ProfilePage from './components/ProfilePage'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

function App() {
  return (
    <div>
      <h1>presentware</h1>
    
   <Router>
    <div>
        <Link to="/">welcome</Link>
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>

    </div>
    <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
    </Routes>
   </Router>
      
  </div>
  )
}

export default App
