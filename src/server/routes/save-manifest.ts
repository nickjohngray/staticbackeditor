import {fieldsAreEmptyMessage} from '../static'
import express from 'express'
import fs from 'fs'
import {IManifest} from '../../shared/typings'
import path from 'path'
import {deletePageComponent, getPageComponentName, makePageComponent} from './route-util'
import {fieldsOk} from '../../shared/util' // move this to share dir
import {ncp} from 'ncp'

const router = express.Router()

const ErrorIn = 'Error in save-manifest.ts '

/*
 Here will Just save the manifest and update files.
 save will not perform publish items
* publish will
* git add .
* git commit
* git push
*
*
*
* */
router.post('/save-manifest', async (req, res) => {
    console.log('in save-manifest.ts ')
    const manifest = req.body.manifest

    if (!fieldsOk(manifest)) {
        res.json({error: +ErrorIn + fieldsAreEmptyMessage})
        return
    }
    const repoName: string = manifest.repoName

    try {
        console.log('Saving ' + repoName)
        const cwd = process.cwd()
        console.log('cwd=' + cwd)

        const manifestPath = path.resolve(process.cwd(), repoName, 'manifest.json')

        console.log('manifestPath=' + manifestPath)

        let manifestOld: IManifest

        // put old manifest into memory then delete it from fs

        if ( fs.existsSync(manifestPath)) {
            console.log('putting  old manifest into memory')
            manifestOld = JSON.parse(await fs.readFileSync(manifestPath, 'utf8'))
            //await fs.unlinkSync(manifestPath)
            // this unlinking does not work on linuex it brakes hot reload
            // fs.write must be used below

            //console.log('deleting  old manifest file')
        } else {
            res.json({error: ErrorIn + 'manifest file does not exist'})
        }
        console.log('saving new  manifest data to manifest file')

        var options = { flag : 'w' };
        fs.writeFile(manifestPath, JSON.stringify(manifest), options, (err) => {
            if (err) { throw err; }

            console.log('file saved');
        });

        console.log('Done!,  manifest file saved')

        //   copy all assets to assets folder
        console.log('Copying assets from ' + repoName + ' to dist/' + repoName + '/src/assets')
        ncp(path.resolve('dist', repoName), path.resolve(repoName, 'src', 'assets'), (err) => {
            if (err) {
                throw new Error('Could not copy assets from ' + repoName + ' to public folder error=' + err.message)
            }
            console.log('Copying images complete.')
        })

        const pages = (manifest as IManifest).pages

        for (let i = 0; i < pages.length; i++) {
            const pageName = getPageComponentName(pages[i].template)

            // pageContent  is set on login, or when a new page is made on the frontend,
            // this file  nees to be made now for preview
            // user may click preview at any time

            const pageContent = pages[i].templateContent
            if (!(await makePageComponent(pageName, repoName, pageContent))) {
                console.log('Could not make page ' + pageName)
            } else {

            }
        }
        console.log('making new pages Done!')
        // making new pages Done!

        // Delete any components  removed from manifest
        const oldPages = (manifestOld as IManifest).pages

        // if old page is not one of the new pages then , the page file components
        // must be deleted and cleaned up
        console.log('deleting removed pages')
        for (let i = 0; i < oldPages.length; i++) {
            const oldPage = oldPages[i]
            // if we dont find it (the old Page in new pages ) delete it( component file )
            const page = pages.find(
                (newPage) => getPageComponentName(newPage.template) === getPageComponentName(oldPage.template)
            )
            if (!page) {
                if (!(await deletePageComponent(getPageComponentName(oldPage.template), repoName))) {
                    console.log('Could not delete page ' + page.template)
                }
            }
        }
        console.log('deleting removed pages Done!')
        console.log('save complete')
        res.sendStatus(200)

    } catch (error) {
        console.log('error===' + error.message)
        res.json({error: ErrorIn + error.message})
    }
})

export {router as saveManifest}
