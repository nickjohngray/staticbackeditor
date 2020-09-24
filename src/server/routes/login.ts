import {fieldsAreEmptyMessage, repoAccount} from '../static'
import express from 'express'
import {getUserInfo, openConnection} from '../mongo/openConnection'
import {cloneRepo} from '../git-util'
import fs from 'fs'
import {IManifest} from '../../shared/typings'
import {
    dumpError,
    getPageComponentName,
    getPageComponentPath,
    installNodeModulesForRepo,
    startUpPreviewRepo
} from './route-util'
import path from 'path'
import {ncp} from 'ncp'
import {fieldsOk} from '../../shared/util'

const router = express.Router()

router.post('/login', async (req, res) => {
    const email: string = req.body.email
    const pwd: string = req.body.pwd
    if (!fieldsOk(email, pwd)) {
        res.json({error: fieldsAreEmptyMessage})
        return
    }
    try {
        const client = await openConnection()
        const userInfo = await getUserInfo(client, email, pwd)
        if (!userInfo) {
            res.json({error: 'Error in login.ts. Incorrect user name & or password'})
        }

        // only get repo if it has not already been cloned
        if (await fs.existsSync(userInfo.repo)) {
            // get pull here if its clean
            // await fs.rmdirSync(userInfo.repo, {recursive: true})
        } else {
            await cloneRepo(repoAccount + userInfo.repo)
        }

        const manifest: IManifest = await JSON.parse(fs.readFileSync(userInfo.repo + '/manifest.json', 'utf8'))

        /*  set the  value of every pages templateContent to the file value of template
         this is needed as we need "one source of truth"  for undo/redo
         when saved is clicked it will create these template files and set the conent*/

        const repoName = manifest.repoName
        if (!repoName) {
            console.log('No repoName  key found in Manifest, this must be set')
            throw new Error('No repoName  key found in Manifest, this must be set')
        }

        // make assets available from current repo to cms , by copying them
        // out of the repo and into the root server directory
        console.log('Copying assets from ' + repoName + '/src/assets to dist/' + repoName)
        ncp(path.resolve(repoName, 'src', 'assets'), path.resolve('dist', repoName), (err) => {
            if (err) {
                throw new Error('Could not copy assets from ' + repoName + ' to public folder error=' + err.message)
            }
            console.log('Copying assets complete.')
        })

        const pages = manifest.pages
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i]
            // get file path of component of this page from template key
            const templatePath = getPageComponentPath(getPageComponentName(page.template), repoName)
            // read the file content into template_content const
            const templateContent = fs.readFileSync(templatePath, 'utf8')
            //  set the  value of templateContent to the value of template_content const
            page.templateContent = templateContent
        }

       await installNodeModulesForRepo(repoName)

        res.json(manifest)
    } catch (error) {
        dumpError(error)
        res.json({error: 'Error in login.ts. ' + error.message})
    }
})

export {router as loginRouter}
