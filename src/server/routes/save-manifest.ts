import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage} from "../static"
import express from 'express'
import {commit, pushToMaster} from "../git-util";
import fs from 'fs';
import {IManifest, IPage} from './../../client/typings'
import path from "path"
import {
    deletePageComponent,
    getPageComponentName, makePageComponet,
    makePageComponetIfNotExist, pageTemplate
} from './util' // move this to share dir

const router = express.Router();

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
        res.json({error: + ErrorIn +  fieldsAreEmptyMessage})
        return;
    }
    const repoName: string = (manifest as IManifest).repoName

    try {

        const manifestPath = path.resolve(
            process.cwd(),repoName,'manifest.json' )

        let manifestOld : IManifest

        // put old manifest into memory then delete it from fs

        if (await fs.existsSync(manifestPath)) {
            console.log('putting  old manifest into memory')
            manifestOld = JSON.parse( await fs.readFileSync(manifestPath, 'utf8'))
            await fs.unlinkSync(manifestPath)
            console.log('deleting  old manifest file')
        } else {
            res.json({error: ErrorIn +  'manifest file does not exist'})
        }
        console.log('saving new  manifest data to manifest file')

        // we dont have to set template content key or or value
        // this will be done on login
        // or frontend can set this key , do this when building the editor
        // for the page , need a standard html pr markdown editor
        // this will be the default editor

        await fs.writeFileSync(manifestPath, JSON.stringify( manifest));
        console.log('Done!,  manifest file saved')

        const pages = (manifest as IManifest).pages
        console.log('making new pages')
        for(let i=0;  i<pages.length; i++ ){
            const pageName = getPageComponentName( pages[i].template)

            // pageContent  is set on login, or when a new page is made on the frontend,
            // this file  nees to be made now for preview
            // user may click preview at any time

            const pageContent =  pages[i].templateContent
             if(!await makePageComponet(pageName,repoName, pageContent) )
            {
              console.log('Could not make page ' + pageName)
            } else {
                 console.log( i + - 'made page  ' + pages[i].template )
             }
        }
        console.log('making new pages Done!')
        // making new pages Done!

        // Delete any components  removed from manifest
        const oldPages = (manifestOld as IManifest).pages

        // if old page is not one of the new pages then , the page file componets
        // must be deleted and cleaned up
        console.log('deleting removed pages')
        for(let i=0;  i<oldPages.length; i++ ){
            const oldPage = oldPages[i]
            // if we dont find it (the old Page in new pages ) delete it( component file )
            const  page = pages.find( (newPage) =>
                getPageComponentName(newPage.template) ===
                getPageComponentName(oldPage.template)  )
            if(!page) {
                if (!await deletePageComponent(getPageComponentName(oldPage.template), repoName))
                    console.log('Could not delete page ' + page.template)
            }
        }
        console.log('deleting removed pages Done!')

        console.log('save complete')

    /*    console.log('committing changes to git')
        await commit(repoName,'Static Back Editor 2 - ' + new Date().toDateString(),'manifest.json')
        console.log('committing changes to git Done!')*/

        res.sendStatus(200)
        // make a publish method for this
        //await pushToMaster(repoName)

    } catch (error) {

        console.log("error===" + error.message )
        res.json({error: ErrorIn +  error.message})
    }
})

export {router as saveManifest}
