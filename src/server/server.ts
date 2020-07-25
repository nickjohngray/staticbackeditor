import express from 'express'
import bodyParser from 'body-parser'
import {indexRouter} from "./routes"
import {commitRouter} from "./routes/commit"
import {cloneRepoRouter} from "./routes/clone-repo"
import {pushToMasterRouter} from "./routes/push-to-master"
import * as path from "path";
import {loginRouter} from "./routes/login";

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(indexRouter)
app.use(commitRouter)
app.use(cloneRepoRouter)
app.use(pushToMasterRouter)
app.use(loginRouter)

app.listen(port, err => {
    if (err) {
        return console.error(err)
    }
    return console.log(`server is listening on ${port}`)
})
