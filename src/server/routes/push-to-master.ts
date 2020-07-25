import {pushToMaster} from "../git-util";
import {fieldsOk} from "../util";
import {fieldsAreEmptyMessage} from "../static";
import express from 'express'

const router = express.Router();

router.post('/push-to-master', async (req, res) => {
    const repoName: string = req.body.repo_name
    if ((!fieldsOk(repoName))) {
        res.send(fieldsAreEmptyMessage)
        return
    }
    try {

        await pushToMaster(repoName)
        res.send('just pushed ' + repoName + ' to master')
    } catch (e) {
        res.send('bad:' + e)
    }
})

export {router as pushToMasterRouter}
