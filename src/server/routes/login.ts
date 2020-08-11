import {fieldsOk} from '../../client/util'
import {fieldsAreEmptyMessage, repoAccount} from '../static'
import express from 'express'
import mongodb from 'mongodb'
import {getUserInfo, openConnection} from './../mongo/openConnection'
import {cloneRepo} from '../git-util'
import fs from 'fs'

const MongoClient = mongodb.MongoClient


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
        if(!userInfo) {
            res.json( {error: 'Error in login.ts. Incorrect user name & or password'})
        }
        if (await fs.existsSync(userInfo.repo)) {
            // get pull here if its clean
            // await fs.rmdirSync(userInfo.repo, {recursive: true})
        } else {
            await cloneRepo(repoAccount + userInfo.repo)
        }

        const manifest = await fs.readFileSync(userInfo.repo + '/manifest.json', 'utf8')
        res.json( JSON.parse(manifest))
    } catch (error) {

        res.json({error: 'Error in login.ts. ' +  error.message})
    }
    //here


    //db.customers.find( { email: "strengthpitotara@gmail.com", pwd: "xyz" } )

    //res.json( {json: { message: 'ABout to log you in'}} )

})

var path = require("path")

var rmdir = function (dir) {
    return new Promise((resolve, reject) => {
        console.log('HERE')
        var list = fs.readdirSync(dir)
        for (var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i])
            var stat = fs.statSync(filename)

            if (filename == "." || filename == "..") {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename)
            } else {
                // rm fiilename
                fs.unlinkSync(filename)
            }
        }
        fs.rmdirSync(dir)
        resolve(true)
    })
}

export {router as loginRouter}
