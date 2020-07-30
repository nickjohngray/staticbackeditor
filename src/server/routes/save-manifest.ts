import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage, repoAccount} from "../static"
import express from 'express'
import mongodb from 'mongodb'
import {commit, pushToMaster} from "../git-util";
import fs from 'fs';
import {pushToMasterRouter} from "./push-to-master";


const MongoClient = mongodb.MongoClient;

const router = express.Router();

router.post('/save-manifest', async (req, res) => {
    const email: string = req.body.email
    const data: string = req.body.data
    const repo: string = req.body.repo
    if (!fieldsOk(email, data, repo)) {
        res.json({json: {message: fieldsAreEmptyMessage}})
        return;
    }
    try {

        const path = repo + '/manifest.json'
        if (await fs.existsSync(path)) {
            await fs.rmdirSync(path, {recursive: true})
        }
        await fs.writeFileSync(path, data);
        await commit(repo,'Static Back Editor 2','manifest.json')
        await pushToMaster(repo)
        res.json({message: 'pushed to master'})



    } catch (error) {

        res.json({error})
    }
    //here


    //db.customers.find( { email: "strengthpitotara@gmail.com", pwd: "xyz" } )

    //res.json( {json: { message: 'ABout to log you in'}} )

})


export {router as saveManifest}
