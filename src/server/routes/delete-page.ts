import {fieldsOk} from '../../client/util'
import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import fs from 'fs'
import path from 'path'
import {capitalize} from 'lodash'

const router = express.Router()
const ErrorIn = 'Error in delete-page.ts '

router.post('/delete-page', async (req, res) => {
    console.log('in save-manifest')
    const pageName: string = req.body.pageName
    const repoName: string = req.body.repoName

    if (!fieldsOk(pageName, repoName)) {
        res.json({error: ErrorIn + fieldsAreEmptyMessage})
        return
    }
    try {
        const pageComponentPagePath = path.resolve(
            process.cwd(),
            repoName,
            'src',
            'components',
            'pages',
            capitalize(pageName) + '.tsx'
        )
        if (await fs.existsSync(pageComponentPagePath)) {
            await fs.rmdirSync(pageComponentPagePath, {recursive: true})
        } else {
            res.json({error: ErrorIn + pageComponentPagePath + ' ' + ' does not exist,  cannot delete-page'})
        }
        console.log('deleted ' + pageComponentPagePath)
        res.sendStatus(200)
    } catch (error) {
        console.log(ErrorIn + error.message)

        res.json({error: ErrorIn + error.message})
    }
})

export {router as deletePage}
