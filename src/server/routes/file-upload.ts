import express from 'express'
import uploader from './../controllers/upload-controller'
import multer from 'multer'
import * as path from 'path'

const router = express.Router()
router.post('/upload', uploader.uploadImages, uploader.resizeImages, uploader.getResult)

/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('come on 0')
        cb(null, '/uploads')
        //path.resolve(process.cwd(), 'easyecom')
    },
    filename: function (req, file, cb) {
        console.log('come on 1')
        cb(null, '00000000XXXXXXX' + Date.now() + '-' + file.originalname)
    }
})*/

// const upload = multer({storage: storage}).single('file')

/*router.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        console.log('A')
        if (err instanceof multer.MulterError) {
            console.log('B')
            return res.status(500).json({error: err})
        } else if (err) {
            console.log('C')
            return res.status(500).json({error: err})
        }
        console.log('D')
        return res.status(200).send(req.file)
    })
})*/

export {router as fileUploaderRouter}
