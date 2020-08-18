import * as path from 'path'

let express = require('express')
let router = express.Router()

router.get('/about', (req, res) => {
    console.log('sending about')
    // res.sendFile('/dist/about.html');
    res.status(201).json({message: 'Hello World!'})
})

export {router as aboutRouter}
