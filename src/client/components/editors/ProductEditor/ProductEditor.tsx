import {IMoveNodeOrLeafToMethod, IObjectPath, IProduct, ISection} from '../../../../shared/typings'
import * as React from 'react'
import Tree from '../../generic/Tree'
import {Constants} from '../../../util'

interface IProps {
    products: IProduct[]
    onUpdate?: (text: string, objectPath: any[]) => void
    onAdd?: (jsonObject: object, objectPath: any[]) => void
    onDelete?: (objectPath: any[]) => void
    imageDirectory?: string
    projectUploadFolder?: string
    onMoveNodeOrLeafTo?: IMoveNodeOrLeafToMethod
}

class ProductEditor extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => (
        <Tree
            imagesPaths={[['image']]}
            imageDirectory={this.props.imageDirectory}
            projectUploadFolder={this.props.projectUploadFolder}
            onUpdate={this.props.onUpdate}
            onDelete={this.props.onDelete}
            onAdd={this.props.onAdd}
            onMoveNodeOrLeafTo={(fromIndex, toIndex, objectPath, fromField, toField) =>
                this.props.onMoveNodeOrLeafTo(
                    fromIndex,
                    toIndex,
                    [Constants.sections].concat(objectPath),
                    fromField,
                    toField
                )
            }
            nodeKeyForObjectsAndArrays="title"
            data={this.props.products}
            skipNode="title"
        />
    )
}

export default ProductEditor
