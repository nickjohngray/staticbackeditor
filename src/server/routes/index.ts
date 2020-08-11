var express = require('express')
var router = express.Router()

router.get('/',  (req, res) => {
    console.log('sending index.html')
    res.sendFile('/dist/index.html')
})

export {router as indexRouter}
