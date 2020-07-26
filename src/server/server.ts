import express from 'express'
import bodyParser from 'body-parser'
import {indexRouter} from "./routes"
import {commitRouter} from "./routes/commit"
import {cloneRepoRouter} from "./routes/clone-repo"
import {pushToMasterRouter} from "./routes/push-to-master"
import * as path from "path";
import {loginRouter} from "./routes/login";

const server = express()
const port = 3001

server.use(bodyParser.urlencoded({extended: true}))
server.use(express.static(path.join(__dirname, 'public')))

server.use(indexRouter)
server.use(commitRouter)
server.use(cloneRepoRouter)
server.use(pushToMasterRouter)
server.use(loginRouter)

server.listen(port, err => {
    if (err) {
        return console.error(err)
    }
    return console.log(`server is listening on ${port}`)
})
