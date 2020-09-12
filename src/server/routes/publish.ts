import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import {IManifest} from '../../shared/typings'
import {fieldsOk} from '../../shared/util' // move this to share dir
import {commit, pushToMaster} from '../git-util'

const router = express.Router()

const ErrorIn = 'Error in PUBLISH route.\n'

/*
 * publish will
 * git add .
 * git commit
 * git push
 * */
router.post('/publish', async (req, res) => {
    console.log('in publish.ts ')
    const manifest = req.body.manifest

    if (!fieldsOk(manifest)) {
        res.json({error: +ErrorIn + fieldsAreEmptyMessage})
        return
    }
    const repoName: string = (manifest as IManifest).repoName

    try {
        console.log('Working with ' + repoName)
        console.log('committing changes to git')
        await commit(repoName, 'Static Back Editor  - ' + new Date().toDateString(), 'manifest.json')
        console.log('committing changes to git Done!')

        // make a publish method for this , and maybe for commit
        console.log('pushing to git!')
        await pushToMaster(repoName)
        console.log('pushing to git Done')
        res.sendStatus(200)
    } catch (error) {
        console.log('error===' + error.message)
        res.json({error: ErrorIn + error.message})
    }
})

export {router as publish}
