import express from 'express'
import bodyParser from 'body-parser'
import {cloneRepo, commit, pushToMaster} from './git-util'
//import {MongoClient} from 'mongodb'

const app = express()
const port = 3000
const repoAccount = 'https://github.com/nickjohngray/'
const fieldsAreEmptyMessage = 'please fill in all fields'

app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, err => {
    if (err) {
        return console.error(err)
    }
    return console.log(`server is listening on ${port}`)
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/' + 'index.html')
})

app.post('/clone-repo', (req, res) => {
    const repoName: string = req.body.repo_name

    if (!fieldsOk(repoName)) {
        res.send(fieldsAreEmptyMessage)
        return
    }

    cloneRepo(repoAccount + repoName).then(() => {
        res.send('just cloned:' + repoName)
    }).catch((e) => {
        res.send('bad:' + e)
    })
})

app.post('/commit', (req, res) => {
    const repoName: string = req.body.repo_name
    const commitMessage: string = req.body.commit_message
    const fileNames: string[] = req.body.file_names.trim() !== '' ? req.body.file_names.split(',') : null

    if ((!fieldsOk(repoName, commitMessage, ...fileNames))) {
        res.send(fieldsAreEmptyMessage)
        return
    }

    commit(repoName, commitMessage, ...fileNames).then(() => {
        res.send('just committed with message:' + commitMessage)
    }).catch((e) => {
        res.send('bad:' + e)
    })

})

app.post('/push-to-master', (req, res) => {
    const repoName: string = req.body.repo_name
    if ((!fieldsOk(repoName))) {
        res.send(fieldsAreEmptyMessage)
        return
    }

    pushToMaster(repoName).then(() => {
        res.send('just pushed ' + repoName + ' to master')
    }).catch((e) => {
        res.send('bad:' + e)
    })

})

const fieldsOk = (...fields: string[]): boolean => {
    const ok = fields.every((field) => field !== '')
    console.log('ok=' + ok)
    return ok
}
