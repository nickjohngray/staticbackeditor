import {fieldsOk} from "../../client/util"
import {fieldsAreEmptyMessage} from "../static"
import express from 'express'
import {commit, pushToMaster} from "../git-util";
import fs from 'fs';
import {IManifest, IPage} from './../../client/typings'
import path from "path"
import {capitalize} from 'lodash' // move this to share dir


const router = express.Router();

const ErrorIn = 'Error in save-manifest.ts '

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
            await fs.rmdirSync(manifestPath, {recursive: true})
            console.log('deleting  old manifest file')
        } else {
            res.json({error: ErrorIn +  'manifest file does not exist'})
        }
        console.log('saving new  manifest data to manifest file')
        await fs.writeFileSync(manifestPath, JSON.stringify( manifest));
        console.log('Done!,  manifest file saved')

        const pages = (manifest as IManifest).pages
        console.log('making new pages')
        for(let i=0;  i<pages.length; i++ ){
            const pageName = getPageComponentName( pages[i].template)
             if(!await makePageComponetIfNotExist(pageName,repoName) )
            {
              console.log('Could not make page ' + pageName)
            } else {
                 console.log( i + - 'made page  ' + pages[i].template )
             }
        }
        console.log('making new pages Done!')
        // making new pages Done!

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

        console.log('committing changes to git')
        await commit(repoName,'Static Back Editor 2 - ' + new Date().toDateString(),'manifest.json')
        console.log('committing changes to git Done!')

        res.sendStatus(200)
        // make a publish method for this
        //await pushToMaster(repoName)

    } catch (error) {

        res.json({error: ErrorIn +  error.message})
    }
})

const deletePageComponent = async (pageName: string, repoName: string) : Promise<boolean> => {
    const pageComponentPath = getPageComponentPath(pageName,repoName)
    if (await fs.existsSync(pageComponentPath)) {
        await fs.unlinkSync(pageComponentPath)
        return true
    } else {
        return  false
    }
}

const makePageComponetIfNotExist = async (pageName: string, repoName: string) : Promise<boolean> =>  {
    const pageComponentPath = getPageComponentPath(pageName,repoName)
    if (await !fs.existsSync(pageComponentPath)) {
        // write new page to the current repo pages dir
        console.log('adding ' + pageComponentPath + ' with content: ' + pageTemplate)
        await fs.writeFileSync(pageComponentPath, pageTemplate)
        return true
    } else {
        console.log(pageComponentPath + ' exists can make')
        return  false
    }
}

const getPageComponentPath = (pageName: string, repoName: string)  =>
   path.resolve(
        process.cwd(),
       repoName,'src','components',
       'pages', capitalize(pageName) + '.tsx' )


const pageTemplate = `import React from 'react'
import SectionList from 'components/SectionList'
import {getPage} from 'components/pages/pageUtil'

export default () => (
    <div className={'page center-it '}>
        <h1>Athletes</h1>
        <SectionList sections={getPage('athletes').sections} />
    </div>
)`

const getPageComponentName = (template: string) : string => {
    const pathBits =  template.split('/')
    console.log('getPageComponentName=== ' + pathBits[pathBits.length-1] )
    return pathBits[pathBits.length-1]
}

export {router as saveManifest}
