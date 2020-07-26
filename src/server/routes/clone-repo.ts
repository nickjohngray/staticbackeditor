import {cloneRepo} from "../git-util"
import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage, repoAccount} from "../static"
import express from 'express'
const router = express.Router();

router.post('/clone-repo', async (req, res) => {
    const repoName: string = req.body.repo_name

    if (!fieldsOk(repoName)) {
        res.send(fieldsAreEmptyMessage)
        return
    }
    try {
        await cloneRepo(repoAccount + repoName)
        res.send('just cloned:' + repoName)
    } catch (e) {
        res.send('bad:' + e)
    }
})

export  {router as cloneRepoRouter}
