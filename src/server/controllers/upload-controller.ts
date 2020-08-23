import multer from 'multer'
import sharp from 'sharp'
import {fieldsAreEmptyMessage} from '../static'
import * as path from 'path'

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
const uploadImages = (req, res, next) => {
    try {
        uploadFiles(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.json({error: 'Too many files to upload'})
                }
            } else if (err) {
                const x = err
                console.log('error WTF' + x.message)
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
    console.log('in resizeImages start  req.files ' + req.files.length)
    // if (!req.files) return next()
    try {
        console.log('in resizeImages 1 ')
        req.body.images = []
        await Promise.all(
            req.files.map(async (file) => {
                console.log('in resizeImages 2 ')
                try {
                    const filename = file.originalname.replace(/\..+$/, '')
                    const newFilename = `bezkoder-${filename}-${Date.now()}.jpeg`
                    console.log('fn:' + newFilename)
                    console.log('in resizeImages 3')
                    await sharp(file.buffer)
                        /*.resize(640, 320)
                        .toFormat('jpeg')
                        .jpeg({quality: 90})*/
                        .toFile(path.resolve('uploads', newFilename))

                    req.body.images.push(newFilename)
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
        console.log('in getResult')

        const images = req.body.images.map((image) => '' + image + '').join(' ')
        let i = req.body.images

        return res.json({error: `Images were uploaded:${images}`})
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
