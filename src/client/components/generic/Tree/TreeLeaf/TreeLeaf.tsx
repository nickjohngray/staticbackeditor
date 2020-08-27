import React, {RefObject} from 'react'
import './TreeLeaf.css'
import EditableLabel from '../../EditableLabel/EditableLabel'
import {LazyLoadImage} from 'react-lazy-load-image-component'
import axios, {AxiosRequestConfig} from 'axios'
import {Constants} from '../../../../util'
import {Wrapper} from '../../Wrapper'

export interface IProps {
    onUpdate: (value: string) => void
    onDelete?: () => void
    imagePath: string
    value: string
    uploadFolder: string
    makeWrapper: boolean
}

interface IState {
    isDirty: boolean
    previewFilesData: any[]
    isImageUploadable: boolean
    viewFullSizeImage: boolean
}

class TreeLeaf extends React.Component<IProps, IState> {
    private readonly inputOpenFileRef: RefObject<HTMLInputElement>
    private form: HTMLFormElement

    constructor(props) {
        super(props)
        this.inputOpenFileRef = React.createRef()
        this.state = {
            previewFilesData: [],
            isDirty: false,
            isImageUploadable: true,
            viewFullSizeImage: false
        }
    }

    render = () => {
        if (this.props.imagePath) {
            return (
                <>
                    {this.state.previewFilesData.length > 0 ? (
                        <div className={'preview-images'}> {this.getPreviewImages()}</div>
                    ) : (
                        <LazyLoadImage
                            className={'lazy-load-image'}
                            onClick={() => this.inputOpenFileRef.current.click()}
                            ttile="Change image"
                            height={100}
                            src={this.props.imagePath}
                            width={100}
                            title="Click to change image"
                        />
                    )}
                    {this.state.isImageUploadable && (
                        <form
                            ref={(form) => {
                                this.form = form
                            }}
                            id={'form'}
                            onSubmit={(e) => this.setPreviewImageData(e)}
                            action="/api/upload"
                            method="POST"
                            encType="multipart/form-data"
                            onChange={(e) => this.setPreviewImageData(e)}>
                            <input
                                ref={this.inputOpenFileRef}
                                id="fileUploadButton"
                                className="file_upload_button"
                                type="file"
                                name="images"
                                multiple
                            />
                        </form>
                    )}
                </>
            )
        }
        return (
            <Wrapper wrapper={(children) => <li className="leaf">{children}</li>} condition={this.props.makeWrapper}>
                <>
                    <EditableLabel
                        onDelete={this.props.onDelete ? () => this.props.onDelete() : undefined}
                        isDeleteable={!!this.props.onDelete}
                        onUpdate={(text) => {
                            this.props.onUpdate(text)
                        }}
                        value={this.props.value}
                    />
                </>
            </Wrapper>
        )
    }

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
                    this.setState({previewFilesData})
                    console.log('All files data is ready for preview')
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
        this.props.onUpdate(response.data.fileNames[0])
        // we are done with this the image has been uploaded

        this.setState({previewFilesData: []})
    }

    getPreviewImages = () =>
        this.state.previewFilesData.map((imgSrc, key) => <img key={key} className="image" src={imgSrc} />)
}

export default TreeLeaf
