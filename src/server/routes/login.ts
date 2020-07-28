
import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage, repoAccount} from "../static"
import express from 'express'
//import {MongoClient} from "mongodb";
import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;

const router = express.Router();

router.post('/login', async (req, res) => {
    const email: string = req.body.email
    const password: string = req.body.password
    if (!fieldsOk(email, password)) {
        res.json( {json: {message: fieldsAreEmptyMessage} } )
        return;
    }

    MongoClient.connect('localhost:27017', (err, client) => {
        if (err) return console.error(err)
        res.json( {json: { message: 'Connected to Database'}} )
    })

    res.json( {json: { message: 'ABout to log you in'}} )

})

export  {router as loginRouter}
