import React, {Fragment, RefObject} from 'react'
import './TreeNode.css'
import {IObjectPath} from '../../../../../shared/typings'
import {IAddablePathConfig, IDeletablePathConfig} from '../Tree'
import {getConfigForPath, isCurrentPathOkForConfig} from '../treeUtil'
import {isEqual} from 'lodash'
import {DragHandle} from '../../Drag/Drag'

export interface IProps {
    nodeName: string
    currentPath: IObjectPath
    nodeEditableLeafPath: string
    leafValue: string
    childKeys: (string | object)[]
    addablePathConfigs: IAddablePathConfig[]
    deletablePaths?: IDeletablePathConfig[]
    toggle: (event) => void
    makeLeaf: (value: string, currentPath: IObjectPath, makeDragHandle: boolean) => void
    // makeLeaf2:  (value: string, currentPath: string[], makeDragHandle: boolean) => void
    onDelete?: (path: IObjectPath) => void
    onAdd?: (jsonObject: object, path: IObjectPath) => void
    reactKey: string | number
    makeDragHandle: boolean
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
            childKeys,
            reactKey,
            onDelete,
            makeDragHandle
        } = this.props

        const x = getConfigForPath(currentPath, addablePathConfigs)

        const config = x as IAddablePathConfig
        const modifiableFields = config && config.options && config.options.modifiableFields
        const objectToAdd = config && config.options && config.options.objectToAdd
        const onResolvePath = config && config.options && config.options.onResolvePath

        let showAddButton: boolean = true

        if (config && config.options && config.options.showAddButton !== undefined) {
            showAddButton = config.options.showAddButton
        }

        return (
            <Fragment key={'tree-node-' + reactKey}>
                {makeDragHandle && <DragHandle />}
                {onDelete &&
                    isCurrentPathOkForConfig(currentPath, undefined, this.props.deletablePaths) &&
                    this.makeDeleteButton(currentPath)}
                {showAddButton &&
                    isCurrentPathOkForConfig(currentPath, childKeys.length, this.props.addablePathConfigs) &&
                    this.makeAddButton(objectToAdd, onResolvePath, currentPath)}
                {modifiableFields && this.makeModifiableFieldsButtons(modifiableFields, childKeys, currentPath)}
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
            </Fragment>
        )
    }

    makeDeleteButton = (currentPath: IObjectPath) => {
        return (
            <button
                key={'tree-node-del-but' + this.props.reactKey}
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
        onResolvePath: (pathIn: IObjectPath) => IObjectPath,
        currentPath: any[]
    ) => {
        return (
            <button
                key={'tree-node-add-but' + this.props.reactKey}
                className="editable_label_add_button"
                title="New"
                onClick={() => {
                    this.props.onAdd(
                        userObjectToAddWhenAddIsClicked,
                        onResolvePath ? onResolvePath(currentPath) : currentPath
                    )
                }}>
                +
            </button>
        )
    }

    makeModifiableFieldsButtons = (
        configFieldKeys: Object[],
        currentFieldJsonObjects: Object[],
        currentPath: any[]
    ) => {
        return configFieldKeys.map((field) => {
            currentFieldJsonObjects.map((currentField) =>
                console.log('currentField=[' + currentField + '][Object.keys(field)[0]=' + Object.keys(field)[0] + ']')
            )

            if (currentFieldJsonObjects.some((currentField) => isEqual(currentField, Object.keys(field)[0]))) {
                // this property is already in the list
                // a button for the user to click on to make this property
                // is not needed
                return <Fragment key={'skipped_' + Object.keys(field)[0] + '-' + this.props.reactKey}> </Fragment>
            }
            return (
                // make a button the user can click to add this property
                // as this property does not exist as a child of this
                // object
                <button
                    // key={'tree-node-add-prop-' + this.props.reactKey}
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
