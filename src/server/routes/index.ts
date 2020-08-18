let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
    console.log('sending index.html')
    res.sendFile('/dist/index.html')
})

export {router as indexRouter}
