import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import fs from 'fs'
import path from 'path'
import {capitalize} from 'lodash'
import {fieldsOk} from '../../shared/util'

const router = express.Router()
const ErrorIn = 'Error in add-page.ts '

router.post('/add-page', async (req, res) => {
    const pageName: string = req.body.pageName
    const pagePath: string = req.body.pagePath
    const repoName: string = req.body.repoName

    if (!fieldsOk(pageName, pagePath, repoName)) {
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

        if (fs.existsSync(pageComponentPagePath)) {
            res.json({error: ErrorIn + pageComponentPagePath + ' ' + ' already exist,  cannot add-page'})
        }
        // write new page to the current repo pages dir
        console.log('adding ' + pageComponentPagePath + ' with content: ' + pageTemplate)
        fs.writeFileSync(pageComponentPagePath, pageTemplate)
        res.sendStatus(200)
    } catch (error) {
        console.log(ErrorIn + error.message)

        res.json({error: ErrorIn + error.message})
    }
})

const pageTemplate = `import React from 'react'
import SectionList from 'components/SectionList'
import {getPage} from 'components/pages/pageUtil'

export default () => (
    <div className={'page center-it '}>
        <h1>Athletes</h1>
        <SectionList sections={getPage('athletes').sections} />
    </div>
)`

export {router as addPage}
