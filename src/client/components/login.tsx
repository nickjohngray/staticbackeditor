import React, {useState} from 'react'
import {fieldsOk} from '../util'
import axios from 'axios'
import {JsonEditor} from "./JsonEditor";

export const Login = () => {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [manifest, setManifest] = useState(null)
    const [repo, setRepo] = useState(null)

    const login = async (event) => {
        event.preventDefault()

        if (!fieldsOk(email, pwd)) {
            alert('fill in all fields')
            return
        }
        try {
            const response = await axios.post('/api/login', {email, pwd})
            if (response.data.error) {
                alert(response.data.error);
                return;
            }
            alert(response.data.message + ', ' + response.data.repo)
            setManifest(response.data.manifest)
            setRepo(response.data.repo)
            response.data.repo
            console.log(response)
        } catch (e) {
            alert(e);
        }
    }

    const saveData = async () => {
        const response = await axios.post('/api/save-manifest',
            {email, pwd, data: manifest, repo})
        if (response.data.error) {
            alert(response.data.error);
            return;
        } else {
            alert('saved');
        }
    }

    return <>
        {!manifest ?
        <form onSubmit={login} action="/api/login" method="POST">
            <input value={email} onChange={(e) => {
                setEmail(e.target.value)
            }} type="text" placeholder="email" name="email"/>
            <input value={pwd} onChange={(e) => {
                setPwd(e.target.value)
            }} type="text" placeholder="pwd" name="pwd"/>
            <button type="submit">Login</button>
        </form> : <JsonEditor dataChnage={ (data) => setManifest(data)}
                              saveData={ saveData }
                              data={manifest} />
        }
    </>


}


