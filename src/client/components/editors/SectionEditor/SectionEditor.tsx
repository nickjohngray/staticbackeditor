import {ISection} from '../../../../shared/typings'
import * as React from 'react'
import Tree from '../../generic/Tree'

interface IProps {
    sections: ISection[]
    onUpdate: (text: string, objectPath: any[]) => void
    onDelete: (objectPath: any[]) => void
    imageDirectory: string
    projectUploadFolder: string
}

interface ISate {
    open: boolean
}

class SectionEditor extends React.Component<IProps, ISate> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => (
        <Tree
            readonlyPaths={[
                [0, 'sections', 0, 'image', 'src'],
                ['image', 'src'],
                [0, 'sections', 0, 'link']
            ]}
            imagesPaths={[['image']]}
            objectToPrimitivePaths={[['image']]}
            imageDirectory={this.props.imageDirectory}
            projectUploadFolder={this.props.projectUploadFolder}
            onUpdate={this.props.onUpdate}
            onDelete={this.props.onDelete}
            ignoreKeys={['opener']}
            nodeKeyForObjectsAndArrays="header"
            data={this.props.sections}
        />
    )
}

export default SectionEditor
