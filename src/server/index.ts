import express from 'express'
import bodyParser from 'body-parser'
import {indexRouter} from './routes'
import {commitRouter} from './routes/commit'
import {cloneRepoRouter} from './routes/clone-repo'
import {preview} from './routes/preview'
import {pushToMasterRouter} from './routes/push-to-master'
import * as path from 'path'
import {loginRouter} from './routes/login'
import {saveManifest} from './routes/save-manifest'
import {testManifest} from './routes/test_manifest'
import {addPage} from './routes/add-page'
import {deletePage} from './routes/delete-page'
import {fileUploaderRouter} from './routes/file-upload'
import {publish} from './routes/publish'
// import cors from 'cors'
const app = express()
const port = 8050
// app.use(cors())


interface IConfig  {
    repoName: string
    previewPort: number
    timeStart: Date
}

declare global {
    namespace NodeJS {
        interface Global {
            configs: IConfig[]
        }
    }
}

global.configs = []




app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('dist'))

const API = '/api'

app.use(API, commitRouter)
app.use(API, cloneRepoRouter)
app.use(API, pushToMasterRouter)
app.use(API, loginRouter)
app.use(API, saveManifest)
app.use(API, publish)
app.use(API, preview)
app.use(API, testManifest)
app.use(API, addPage)
app.use(API, deletePage)
app.use(API, fileUploaderRouter)
app.use(indexRouter)

app.use('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'))
})

/*
app.get('*', (req, res) => {
    console.log('sending index.html')
    res.sendFile(path.resolve('dist', 'index.html'))
})*/

app.listen(port, (err) => {
    if (err) {
        return console.error(err)
    }
    return console.log(`server is listening on ${port}`)
})

// Callback function for checking connecting or error
app.on('error', (err) => {
    return console.error(err)
})
