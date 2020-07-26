
import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage, repoAccount} from "../static"
import express from 'express'
const router = express.Router();

router.post('/login', async (req, res) => {
    const email: string = req.body.email
    const password: string = req.body.password

    if (!fieldsOk(email, password)) {
        res.json( {json: {message: fieldsAreEmptyMessage} } )
        return;
    }
    res.json( {json: { message: 'ABout to log you in'}} )

})

export  {router as loginRouter}
