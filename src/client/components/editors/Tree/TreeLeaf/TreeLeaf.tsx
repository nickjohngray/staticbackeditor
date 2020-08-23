import React, {FormEvent} from 'react'
import './TreeLeaf.css'
import EditableLabel from '../../EditableLabel/EditableLabel'
import {LazyLoadImage} from 'react-lazy-load-image-component'
import webpack from 'webpack'
import ImageUploader from 'react-images-upload'
import axios, {AxiosRequestConfig} from 'axios'

export interface IProps {
    onUpdate: (text: string) => void
    onDelete?: () => void
    imagePath: string
    value: string
}

interface IState {
    isDirty: boolean
    previewFilesData: any[]
    isImageUploadable: boolean
    viewFullSizeImage: boolean
}

class TreeLeaf extends React.Component<IProps, IState> {
    form: HTMLFormElement

    constructor(props) {
        super(props)
        this.state = {
            previewFilesData: [],
            isDirty: false,
            isImageUploadable: true,
            viewFullSizeImage: false
        }
    }

    upload = async (e) => {
        e.preventDefault()
        const config: AxiosRequestConfig = {
            headers: {'content-type': 'multipart/form-data'}
        }
        let response = await axios.post('/api/upload', new FormData(this.form), config)
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
                }
            }
        }
    }

    getPreviewImages = () => this.state.previewFilesData.map((imgSrc) => <img alt="wtf" src={imgSrc} />)

    render = () => {
        if (this.props.imagePath) {
            return (
                <>
                    {this.state.previewFilesData.length > 0 ? (
                        <div className={'preview-images'}> {this.getPreviewImages()}</div>
                    ) : (
                        <LazyLoadImage
                            onClick={() => this.setState({viewFullSizeImage: true})}
                            ttile="Change image"
                            height={100}
                            src={this.props.imagePath}
                            width={100}
                        />
                    )}
                    {this.state.isImageUploadable && (
                        <form
                            ref={(form) => {
                                this.form = form
                            }}
                            id={'form'}
                            onSubmit={(e) => this.upload(e)}
                            action="/api/upload"
                            method="POST"
                            encType="multipart/form-data"
                            onChange={(event) => this.setPreviewImageData(event)}>
                            <input type="file" name="images" multiple id="input-images" />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </>
            )
        }
        return (
            <li className="leaf">
                <EditableLabel
                    onDelete={this.props.onDelete ? () => this.props.onDelete() : undefined}
                    isDeleteable={!!this.props.onDelete}
                    onUpdate={(text) => {
                        this.props.onUpdate(text)
                    }}
                    value={this.props.value}
                />
            </li>
        )
    }
}

export default TreeLeaf
