import {commit} from '../git-util'
import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import {fieldsOk} from '../../shared/util'

const router = express.Router()

router.post('/commit', async (req, res) => {
    const repoName: string = req.body.repo_name
    const commitMessage: string = req.body.commit_message
    const fileNames: string[] = req.body.file_names.trim() !== '' ? req.body.file_names.split(',') : null

    if (!fieldsOk(repoName, commitMessage, ...fileNames)) {
        res.send(fieldsAreEmptyMessage)
        return
    }
    try {
        await commit(repoName, commitMessage, ...fileNames)
        res.send('just committed with message:' + commitMessage)
    } catch (e) {
        res.send('bad:' + e)
    }
})

export {router as commitRouter}
