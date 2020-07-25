
import {fieldsOk} from "../util"
import {fieldsAreEmptyMessage, repoAccount} from "../static"
import express from 'express'
const router = express.Router();

router.post('/login', async (req, res) => {
    const email: string = req.body.email
    const password: string = req.body.password

    if (!fieldsOk(email, password)) {
        res.send(fieldsAreEmptyMessage)
        return;
    }
    res.send('going to log in')

    try {
        //await cloneRepo(repoAccount + repoName)
        //res.send('just cloned:' + repoName)
    } catch (e) {
        //res.send('bad:' + e)
    }
})

export  {router as loginRouter}
