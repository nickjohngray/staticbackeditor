import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage} from "../static"
import express from 'express'
import {commit, pushToMaster} from "../git-util";
import fs from 'fs';

const router = express.Router();

const ErrorIn = 'Error in save-manifest.ts '

router.post('/save-manifest', async (req, res) => {
    const manifest: string = req.body.manifest
    const repoName: string = req.body.repoName
    if (!fieldsOk(manifest, repoName)) {
        res.json({error: + ErrorIn +  fieldsAreEmptyMessage})
        return;
    }
    try {
        const path = repoName + '/manifest.json'
        if (await fs.existsSync(path)) {
            await fs.rmdirSync(path, {recursive: true})
        }
        await fs.writeFileSync(path, JSON.stringify( manifest));
        await commit(repoName,'Static Back Editor 2 - ' + new Date().toDateString(),'manifest.json')
        res.sendStatus(200)
        // make a publish method for this
        //await pushToMaster(repoName)

    } catch (error) {

        res.json({error: ErrorIn +  error.message})
    }
})


export {router as saveManifest}
