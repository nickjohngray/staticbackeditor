import React, {RefObject} from 'react'
import './TreeNode.css'
import {IPath} from '../../../../../shared/typings'
import {IAddablePathConfig} from '../Tree'
import {getConfigForPath, isOk} from '../treeUtil'
import {cloneDeep, isEqual} from 'lodash'

export interface IProps {
    nodeName: string
    currentPath: IPath
    nodeEditableLeafPath: string
    leafValue: string
    nodeJson: Object
    addablePathConfigs: IAddablePathConfig[]
    isDeletable: boolean
    toggle: (event) => void
    makeLeaf: (value: string, currentPath: IPath, makeWrapper: boolean) => void
    onDelete?: (path: any[]) => void
    onAdd?: (jsonObject: object, path: IPath[]) => void
}

class TreeNode extends React.Component<IProps> {
    constructor(props) {
        super(props)
    }

    render = () => {
        const {
            toggle,
            makeLeaf,
            leafValue,
            nodeName,
            currentPath,
            nodeEditableLeafPath,
            addablePathConfigs,
            nodeJson,
            isDeletable
        } = this.props

        const config: IAddablePathConfig = getConfigForPath(currentPath, addablePathConfigs)
        const modifiableFields = config && config.options && config.options.modifiableFields
        const objectToAdd = config && config.options && config.options.objectToAdd
        const onResolvePath = config && config.options && config.options.onResolvePath

        let showAddButton: boolean = true

        if (config && config.options && config.options.showAddButton !== undefined) {
            showAddButton = config.options.showAddButton
        }

        const currentFields = Object.keys(nodeJson)

        const childrenCount = Object.keys(nodeJson).length

        return (
            <>
                {isDeletable && this.makeDeleteButton(currentPath)}
                {showAddButton &&
                    isOk(currentPath, childrenCount, this.props.addablePathConfigs) &&
                    this.makeAddButton(objectToAdd, onResolvePath, currentPath)}
                {modifiableFields && this.makeModifiableFieldsButtons(modifiableFields, currentFields, currentPath)}
                <span
                    className="caret node"
                    onClick={(e) => {
                        toggle(e)
                    }}>
                    {/*   make a normal node or an editable leaf*/}
                    {nodeEditableLeafPath
                        ? makeLeaf(leafValue, currentPath.concat(nodeEditableLeafPath), false)
                        : nodeName}
                    {this.context.isDebug && <span className="debug">'Node PATH=' {currentPath} </span>}
                </span>
            </>
        )
    }

    makeDeleteButton = (currentPath: IPath) => {
        return (
            <button
                className="editable_label_delete_button"
                title="delete"
                onClick={() => this.props.onDelete(currentPath)}>
                X
            </button>
        )
    }
    // todo get rid of the any
    makeAddButton = (
        userObjectToAddWhenAddIsClicked: {},
        onResolvePath: (pathIn: IPath) => IPath,
        currentPath: any[]
    ) => {
        return (
            <button
                className="editable_label_add_button"
                title="add"
                onClick={() => {
                    this.props.onAdd(
                        userObjectToAddWhenAddIsClicked,
                        onResolvePath ? onResolvePath(currentPath) : currentPath
                    )
                }}>
                Add
            </button>
        )
    }

    makeModifiableFieldsButtons = (
        configFieldKeys: Object[],
        currentFieldJsonObjects: Object[],
        currentPath: any[]
    ) => {
        return configFieldKeys.map((field) => {
            if (currentFieldJsonObjects.some((currentField) => isEqual(currentField, Object.keys(field)[0]))) {
                // this property is already in the list
                // a button for the user to click on to make this property
                // is not needed
                return <> </>
            }
            return (
                // make a button the user can click to add this property
                // as this property does not exist as a child of this
                // object
                <button
                    className="modifiable_fields_add_button"
                    title="add"
                    onClick={() => this.props.onAdd(field, currentPath)}>
                    +{Object.keys(field)[0]}
                </button>
            )
        })
    }
}

export default TreeNode
