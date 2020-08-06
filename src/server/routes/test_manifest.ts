import express from 'express'
import fs from 'fs';
import * as path from "path";

const router = express.Router();

router.get('/manifest', async (req, res) => {
    try {

        console.log(process.cwd())

        const manifest = await fs.readFileSync(   path.resolve(process.cwd(),'src','server', 'manifest.json'), 'utf8')

        res.json({manifest:  JSON.parse(manifest)} )
        console.log('sending  json')
    } catch (error) {
        res.json({error : error.message})
        console.log(error.number + ' ' +  error.message)
    }

})



export {router as testManifest}
