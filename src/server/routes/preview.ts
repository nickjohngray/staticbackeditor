import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import {IManifest} from '../../shared/typings'
import {fieldsOk} from '../../shared/util' // move this to share dir
import {commit, pushToMaster} from '../git-util'
import {startUpPreviewRepo} from './route-util'

const router = express.Router()

const ErrorIn = 'Error in PREVIEW route.\n'

/*
 * publish will
 * git add .
 * git commit
 * git push
 * */
router.post('/preview', async (req, res) => {
    console.log('in preview.ts ')
    const manifest = req.body.manifest

    if (!fieldsOk(manifest)) {
        res.json({error: +ErrorIn + fieldsAreEmptyMessage})
        return
    }
    console.log('WTF')
    const repoName: string = (manifest as IManifest).repoName

    try {
        console.log('Starting Preview for ' + repoName)
        console.log('committing changes to git')
      const previewPort =  await  startUpPreviewRepo(repoName)
        if(previewPort) {
            console.log('Preview ready for ' + repoName)
            res.json({previewPort})
        } else {
            throw 'error trying to load preview for ' + repoName
        }
    } catch (error) {
        console.log('error===' + error.message)
        res.json({error: ErrorIn + error.message})
    }
})

export {router as preview}
