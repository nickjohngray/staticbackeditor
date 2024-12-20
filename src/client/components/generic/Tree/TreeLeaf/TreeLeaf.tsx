import React from 'react'
import './TreeLeaf.css'
import LabelEditor from './../../../editors/LabelEditor/LabelEditor'
import {LazyLoadImage} from 'react-lazy-load-image-component'
import FileUploader from '../../FileUploader/FileUploader'
import {Something} from '../../Something'
import {IDeletablePathConfig} from '../Tree'
import {getConfigForPath} from '../treeUtil'
import {IFieldDataType, IObjectPath} from '../../../../../shared/typings'
import {DragHandle} from '../../Drag/DragHandle'

export interface IProps {
    onUpdate: (value: string) => void
    onDelete?: () => void
    imagePath: string
    value: string
    uploadFolder: string
    makeDragHandle: boolean
    type?: IFieldDataType
    label: string
}

interface IState {
    previewFile: any
    isImageUploadable: boolean
    showFileUploaderDialog: boolean
}

class TreeLeaf extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)
        this.state = {
            previewFile: null,
            isImageUploadable: true,
            showFileUploaderDialog: false
        }
    }

    render = () => {
        if (this.props.imagePath) {
            return (
                <>
                    <LazyLoadImage
                        className={'lazy-load-imageVariationItem'}
                        onClick={() => this.setState({showFileUploaderDialog: true})}
                        ttile="Change imageVariationItem"
                        height={100}
                        src={this.state.previewFile ? this.state.previewFile : this.props.imagePath}
                        width={100}
                        title="Click to change imageVariationItem"
                    />
                    {this.state.isImageUploadable && (
                        <FileUploader
                            onPreviewReady={(previewFilesData) => this.setState({previewFile: previewFilesData[0]})}
                            activate={this.state.showFileUploaderDialog}
                            onUpload={(fileNameSetAtBackend) => {
                                this.setState({showFileUploaderDialog: false})
                                this.props.onUpdate(fileNameSetAtBackend)
                            }}
                            uploadFolder={this.props.uploadFolder}
                        />
                    )}
                </>
            )
        }

        return (
            <Something
                content={(children) => <li className="leaf">{children}</li>}
                warpInParent={this.props.makeDragHandle}>
                <>
                    {/* drag will m ake the li*/}
                    {this.props.makeDragHandle && <DragHandle />}
                    <LabelEditor
                        type={this.props.type}
                        onDelete={
                            this.props.onDelete
                                ? () => {
                                      this.props.onDelete()
                                  }
                                : undefined
                        }
                        onUpdate={(text) => {
                            this.props.onUpdate(text)
                        }}
                        value={this.props.value}
                        label={this.props.label}
                    />
                </>
            </Something>
        )
    }

    /* // called when the user confirms the file dialog
    setPreviewImageData = (event) => {
        const previewFiles = event.target.files

        let previewFiles = []

        for (let i = 0; i < previewFiles.length; i++) {
            const reader = new FileReader()
            let file = previewFiles[i]
            reader.readAsDataURL(file)

            reader.onload = (event: ProgressEvent<FileReader>) => {
                // @ts-ignore
                previewFiles.push(event.target.result)
                if (previewFiles.length === previewFiles.length) {
                    this.setState({previewFiles})
                    console.log('All files data is ready for preview')
                    this.upload()
                }
            }
        }
    }*/

    /*upload = async (e = null) => {
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
            throw new Error('Backend did not return new file name for uploaded imageVariationItem')
        }
        this.props.onUpdate(response.data.fileNames[0])
        // we are done with this the imageVariationItem has been uploaded

        this.setState({previewFiles: []})
    }*/
}

export default TreeLeaf
