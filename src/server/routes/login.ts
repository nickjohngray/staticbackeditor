import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage, repoAccount} from "../static"
import express from 'express'
//import {MongoClient} from "mongodb";
import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient;

const router = express.Router();

router.post('/login', async (req, res) => {
    const email: string = req.body.email
    const pwd: string = req.body.password
    if (!fieldsOk(email, pwd)) {
        res.json({json: {message: fieldsAreEmptyMessage}})
        return;
    }

    MongoClient.connect('mongodb://localhost:27017/staticback', (err, client) => {
        if (err) return console.error(err)

        //go ahead and make the query...
        client
            .db('staticback')
            .collection('customers')
            .findOne({email, pwd}, {projection:{ repo: 1,_id: 0}},  (mErr, data) => {
                if (mErr) {
                    console.log('BAD ERROR' + mErr)
                    res.json({json: {message: 'Connected to Database but error'}, error: mErr})
                } else {
                    console.log('GOOD' + JSON.stringify( data))
                    res.json( {message: 'Connected to Database ', repo: data.repo})
                }
            })
    });


    //db.customers.find( { email: "strengthpitotara@gmail.com", pwd: "xyz" } )

    //res.json( {json: { message: 'ABout to log you in'}} )

})

export {router as loginRouter}
