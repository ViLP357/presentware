import { useState } from 'react'
import loginService from '../services/login'
import LoginForm from "./LoginForm"

const WelcomePage = ()=>  {


    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('') 
    const [user, setUser] = useState(null)

    const handleLogin = async event => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            setUser(user)
            setUsername('')
            setPassword('')
            } catch {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
            }
   }

    return (
        <div>
        <p>test</p>
            {!user && <LoginForm handleLogin={handleLogin}/>}
          
            {user && (
            <div>
                <p>{user.username} logged in</p>
            
            </div>
            )}
          
        </div>
    )
}
export default WelcomePage