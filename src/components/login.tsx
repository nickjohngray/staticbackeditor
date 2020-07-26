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
                await axios.post('/login', {email, password})
            } catch (e) {
                alert(e);
            }
        }
    }
    return (<div>
        <form onSubmit={login} action="/login" method="POST">
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


