import React, {useState} from 'react'
import {fieldsOk} from '../util'
import axios from 'axios'

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const login = async (event) => {
        event.preventDefault()

        if (fieldsOk(email, password)) {
            try {
               const response = await axios.post('/api/login', {email, password})
                if(response.data.error) {
                    alert(response.data.error);
                    return;
                }
                alert(response.data.message + ', ' + response.data.repo)
                console.log(response)
            } catch (e) {
                alert(e);
            }
        } else {
            alert('fill in all fields')
        }
    }
    return (<div>xs
        <form onSubmit={login} action="/api/login" method="POST">
            <input value={email} onChange={(e) => {
                setEmail(e.target.value)
            }} type="text" placeholder="email" name="email"/>
            <input value={password} onChange={(e) => {
                setPassword(e.target.value)
            }} type="text" placeholder="password" name="password"/>
            <button type="submit">Login</button>
        </form>
    </div>)
}


