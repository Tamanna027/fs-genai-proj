import React,{useState} from 'react'
import "../auth.form.scss"
import { Link,useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = ueState("")

    const {loading,handleRegister} = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username,email,password })
        navigate("/")
    }
    if(loading){
        return(<main><h1>loading..</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="name">name</label>
                        <input
                            onChange={(e) => {setUsername(e.target.value)}}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="enter name"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">email</label>
                        <input
                            onChange={(e) => {setEmail(e.target.value)}}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="enter email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">password</label>
                        <input
                            onChange={(e) => {setPassword(e.target.value)}}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="enter password"
                        />
                    </div>

                    <button className="button primary-button">
                        Register
                    </button>

                </form>
                <p>Already have an account? <Link to = {"/login"}>Login </Link> </p>
            </div>
        </main>
    )
}

export default Register