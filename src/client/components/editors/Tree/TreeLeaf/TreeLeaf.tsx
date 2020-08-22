import React from 'react'
import './TreeLeaf.css'
import EditableLabel from '../../EditableLabel/EditableLabel'
import {LazyLoadImage} from 'react-lazy-load-image-component'
import webpack from 'webpack'
import ImageUploader from 'react-images-upload'

export interface IProps {
    onUpdate: (text: string) => void
    onDelete?: () => void
    imagePath: string
    value: string
}

interface IState {
    isDirty: boolean
    pictures: string[]
    showImageUploader: boolean
    viewFullSizeImage: boolean
}

class TreeLeaf extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)
        this.state = {isDirty: false, pictures: [], showImageUploader: false, viewFullSizeImage: false}
    }
    onDrop = (picture) => {
        this.setState({
            pictures: this.state.pictures.concat(picture),
            showImageUploader: false
        })
    }

    render = () => {
        if (this.state.showImageUploader) {
            return (
                <ImageUploader
                    withPreview={true}
                    withIcon={true}
                    buttonText="Choose images"
                    onChange={this.onDrop}
                    imgExtension={['.jpeg', '.jpg', '.gif', '.png', '.gif']}
                    maxFileSize={5242880}
                    singleImage={true}
                />
            )
        }
        if (this.props.imagePath) {
            return (
                <>
                    <LazyLoadImage
                        onClick={() => this.setState({showImageUploader: true})}
                        ttile="Change image"
                        height={100}
                        src={this.props.imagePath}
                        width={100}
                    />
                    <button onClick={() => this.setState({viewFullSizeImage: true})}>View full Size</button>
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
