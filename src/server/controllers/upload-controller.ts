import multer from 'multer'
import sharp from 'sharp'
import * as path from 'path'
import {fieldsOk} from '../../shared/util'
import {fieldsAreEmptyMessage} from '../static'

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb('Please upload only images.', false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadFiles = upload.array('images', 10)

const ErrorIn = 'Error in upload-controller.ts '

const uploadImages = (req, res, next) => {
    try {
        uploadFiles(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.json({error: 'Too many files to upload'})
                }
            } else if (err) {
                const x = err
                return res.json({error: +x.message})
            }

            next()
        })
    } catch (e) {
        console.log('in catch uploadImages error' + e)
        return res.json({error: +e.message})
    }
}

const resizeImages = async (req, res, next) => {
    try {
        const projectUploadFolder = req.body.projectUploadFolder
        if (!fieldsOk(projectUploadFolder)) {
            return res.json({error: +ErrorIn + fieldsAreEmptyMessage})
        }

        req.body.images = []
        await Promise.all(
            req.files.map(async (file) => {
                try {
                    const filename = file.originalname.replace(/\..+$/, '')
                    const newFileName = `${filename}-${Date.now()}.jpeg`
                    await sharp(file.buffer)
                        .resize(640, 320)
                        .toFormat('jpeg')
                        .jpeg({quality: 90})
                        // save the new image to dist folder where react can get it
                        // on save these images should be copied to repo folder
                        .toFile(path.resolve('dist', projectUploadFolder, newFileName))

                    req.body.images.push(newFileName)
                } catch (e) {
                    console.log('error in  resizeImages' + e)
                }
            })
        ).catch((e) => {
            console.log('error in resizeImages ' + e)
            return res.json({error: +e.message})
        })
        next()
    } catch (e) {
        console.log(e)
        return res.json({error: +e.message})
    }
}

const getResult = async (req, res) => {
    try {
        if (!req.body.images) {
            return res.json({error: 'images object not found on body'})
            console.log('images object not found on body')
        }

        if (req.body.images.length <= 0) {
            return res.json({error: 'pick an image'})
        }
        // console.log('in getResult')

        const images = req.body.images.map((image) => '' + image + '').join(' ')
        let i = req.body.images

        return res.json({fileNames: req.body.images})
    } catch (e) {
        console.log(e)
        return res.json({error: +e.message})
    }
}

export default {
    uploadImages,
    resizeImages,
    getResult
}
