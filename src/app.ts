import express from 'express'
import bodyParser from 'body-parser';
import {cloneRepo, commit} from './git-util'
//import {MongoClient} from 'mongodb';

const app = express()
const port = 3000
const repoAccount = 'https://github.com/nickjohngray/'

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
    const repoName: string = req.body.repo_name;
    if (repoName.trim() !== '') {
        clone(repoName).then(() => {
            res.send('just cloned:' + repoName )
        }).catch((e) => {
            res.send('bad:' + e)
        })
    }
})

const clone = async (repoName: string) => {
    try {
        await cloneRepo(repoAccount + repoName)
    } catch (e) {
        throw e
    }
}
