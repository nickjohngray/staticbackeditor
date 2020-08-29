import React, {RefObject} from 'react'
import './FileUpLoader.css'
import axios, {AxiosRequestConfig} from 'axios'
import {Constants} from '../../../util'

export interface IProps {
    onUpload: (fileNameSetAtBackend: string) => void
    onDelete?: () => void
    uploadFolder: string
    isMultiple?: boolean
    onPreviewReady: (previewFilesData: any[]) => void
    activate: boolean
}

class FileUploader extends React.Component<IProps> {
    private readonly inputTypeFile: RefObject<HTMLInputElement>
    private form: HTMLFormElement

    constructor(props) {
        super(props)
        this.state = {activate: false}
        this.inputTypeFile = React.createRef()
    }
    // todo change this to   getDerivedStateFromProps
    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (nextProps.activate && !this.props.activate) {
            this.inputTypeFile.current.click()
        }
    }

    render = () => (
        <form ref={(form) => (this.form = form)} onChange={(e) => this.setPreviewImageData(e)}>
            <input
                ref={this.inputTypeFile}
                className="file_upload_button"
                type="file"
                name="images"
                multiple={this.props.isMultiple}
            />
        </form>
    )

    // called when the user confirms the file dialog
    setPreviewImageData = (event) => {
        const previewFiles = event.target.files

        let previewFilesData = []

        for (let i = 0; i < previewFiles.length; i++) {
            const reader = new FileReader()
            let file = previewFiles[i]
            reader.readAsDataURL(file)

            reader.onload = (event: ProgressEvent<FileReader>) => {
                // @ts-ignore
                previewFilesData.push(event.target.result)
                if (previewFilesData.length === previewFiles.length) {
                    this.props.onPreviewReady(previewFilesData)
                    if (this.context.isDebug) {
                        console.log('All files data is ready for preview')
                    }

                    this.upload()
                }
            }
        }
    }

    upload = async (e = null) => {
        if (e) {
            e.preventDefault()
        }
        const config: AxiosRequestConfig = {
            headers: {'content-type': 'multipart/form-data'}
        }
        const formData = new FormData(this.form)
        formData.append(Constants.projectUploadFolder, this.props.uploadFolder)
        let response = await axios.post('/api/upload', formData, config)
        if (!response.data.fileNames) {
            throw new Error('Backend did not return new file name for uploaded image')
        }
        this.props.onUpload(response.data.fileNames[0])
    }
}

export default FileUploader
