import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import {IManifest} from '../../shared/typings'
import {fieldsOk} from '../../shared/util' // move this to share dir
import {commit, pushToMaster} from '../git-util'
import {killPreview, startUpPreviewRepo} from './route-util'

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
    const repoName: string = (manifest as IManifest).repoName

    try {
        console.log('Starting Preview for ' + repoName)

        // if repo is already built return the preview port
        const repoExists = global.configs.find( (c) =>  c.repoName === repoName)
        if(repoExists && repoExists.previewPort) {
            res.json({previewPort: repoExists.previewPort})
            return
        }

        const previewPort =  await  startUpPreviewRepo(repoName) as string

        if(previewPort) {

            // remember the preview port
            const repoExists = global.configs.find( (c) =>  c.repoName === repoName)
            if(repoExists) {
               // const portFixed : number =  parseInt( previewPort.substring(0, 4),10)
                const portFixed : number =  parseInt( previewPort,10)
                repoExists.previewPort = portFixed
            } else {
                throw 'repo must exists if we get in preview'
            }

            console.log('Preview ready for ' + repoName)

            console.log('killing preview in  30 mins')
            setTimeout ( () => {
                killPreview(previewPort as string)
                const repoExists = global.configs.find( (c) =>  c.repoName === repoName)
                repoExists.previewPort = undefined
                console.log('30 mins up! Preview killed for ' + repoName)
            },1000 * 60 * 30) // 30 minds

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
