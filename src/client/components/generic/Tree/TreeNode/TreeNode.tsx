import React, {Fragment, RefObject} from 'react'
import './TreeNode.css'
import {IObjectPath} from '../../../../../shared/typings'
import {IAddablePathConfig, IDeletablePathConfig, IObjectsToAdd} from '../Tree'
import {getConfigForPath, isCurrentPathOkForConfig} from '../treeUtil'
import {isEqual, isFunction} from 'lodash'
import {DragHandle} from '../../Drag/Drag'
import SplitButton from '../../SplitButton/SplitButton'
import {asArray} from 'simple-git/src/lib/utils'

export interface IProps {
    nodeName: string
    currentPath: IObjectPath
    nodeEditableLeafPath: string
    leafValue: string
    childKeys: (string | object)[]
    addable: IAddablePathConfig[]
    deletable?: IDeletablePathConfig[]
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
        const {toggle, currentPath, addable, childKeys, reactKey, onDelete, makeDragHandle, nodeName} = this.props

        const config = getConfigForPath(currentPath, addable)

        const deleableConfig = config as IDeletablePathConfig
        const onResolveDeletePath = deleableConfig && deleableConfig.options && deleableConfig.options.onResolvePath

        const addableConfig = config as IAddablePathConfig
        const modifiableFields = addableConfig && addableConfig.options && addableConfig.options.modifiableFields
        const objectsToAdd = addableConfig && addableConfig.options && (addableConfig.options.object as IObjectsToAdd)
        const onResolveAddPath = addableConfig && addableConfig.options && addableConfig.options.onResolvePath

        const isSplitButtonMade = Array.isArray(objectsToAdd)
        let showAddButton: boolean = true

        if (addableConfig && addableConfig.options && addableConfig.options.showAddButton !== undefined) {
            showAddButton = addableConfig.options.showAddButton
        }

        return (
            <Fragment key={'tree-node-' + reactKey}>
                {makeDragHandle && <DragHandle />}
                {onDelete &&
                    isCurrentPathOkForConfig(currentPath, undefined, this.props.deletable) &&
                    this.makeDeleteButton(currentPath, onResolveDeletePath)}
                {showAddButton &&
                    isCurrentPathOkForConfig(currentPath, childKeys.length, this.props.addable) &&
                    this.makeAddButton(objectsToAdd, onResolveAddPath, currentPath, nodeName)}
                {modifiableFields && this.makeModifiableFieldsButtons(modifiableFields, childKeys, currentPath)}
                <span
                    className="caret node"
                    onClick={(e) => {
                        toggle(e)
                    }}>
                    {/*   make a normal node or an editable leaf*/}
                    {isSplitButtonMade ? <></> : this.getNodeLabel()}
                    {this.context.isDebug && <span className="debug">'Node PATH=' {currentPath} </span>}
                </span>
            </Fragment>
        )
    }

    getNodeLabel = () => {
        {
            const {nodeEditableLeafPath, makeLeaf, leafValue, currentPath, nodeName} = this.props
            if (nodeEditableLeafPath) {
                return makeLeaf(leafValue, currentPath.concat(nodeEditableLeafPath), false)
            }
            return nodeName
        }
    }

    makeDeleteButton = (currentPath: IObjectPath, onResolvePath: (pathIn: IObjectPath) => IObjectPath) => {
        return (
            <button
                key={'tree-node-del-but' + this.props.reactKey}
                className="editable_label_delete_button"
                title="delete ME"
                onClick={() => {
                    this.props.onDelete(onResolvePath ? onResolvePath(currentPath) : currentPath)
                }}>
                X
            </button>
        )
    }
    // todo get rid of the any
    makeAddButton = (
        objectsToAddOrFuncToCall: IObjectsToAdd | IObjectsToAdd[] | ((pathIn: IObjectPath) => {}),
        onResolvePath: (pathIn: IObjectPath) => IObjectPath,
        currentPath: any[],
        nodeName: string
    ) => {
        if (Array.isArray(objectsToAddOrFuncToCall)) {
            const objects: IObjectsToAdd[] = objectsToAddOrFuncToCall

            return (
                <SplitButton
                    items={objects.map((obj, id) => {
                        let label = obj.name
                        // this will add node to the first button in the split button
                        // like  [+ product ]
                        if (id === 0) {
                            label = label + ' ' + nodeName
                        }
                        return {label, id}
                    })}
                    onClick={(index) => {
                        this.props.onAdd(
                            objects[index].object,
                            onResolvePath ? onResolvePath(currentPath) : currentPath
                        )
                    }}
                />
            )
        }

        return (
            <button
                key={'tree-node-add-but' + this.props.reactKey}
                className="editable_label_add_button"
                title="New"
                onClick={() => {
                    let objectToAdd: {} | [] = null
                    if (isFunction(objectsToAddOrFuncToCall)) {
                        const funcToCall: (pathIn: IObjectPath) => {} = objectsToAddOrFuncToCall
                        objectToAdd = funcToCall(currentPath)
                    } else {
                        objectToAdd = objectsToAddOrFuncToCall
                    }
                    this.props.onAdd(objectToAdd, onResolvePath ? onResolvePath(currentPath) : currentPath)
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
            /* currentFieldJsonObjects.map((currentField) =>
               console.log('currentField=[' + currentField + '][Object.keys(field)[0]=' + Object.keys(field)[0] + ']')
            )*/

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
