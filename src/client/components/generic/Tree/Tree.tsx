import React, {Fragment, RefObject, useContext} from 'react'
import './Tree.css'
import {isEqual, cloneDeep} from 'lodash'
import TreeLeaf from './TreeLeaf/TreeLeaf'
import MainContext from '../../../context/MainContext'
import {Constants, isPrimitive} from '../../../util'
import {
    IDefaultFieldOrder,
    IFieldDataType,
    IMoveNodeOrLeafToMethod,
    IObjectPath,
    ISection
} from '../../../../shared/typings'
import TreeNode from './TreeNode/TreeNode'
import {
    Config,
    SortableContainer,
    SortableContainerProps,
    SortableElement,
    SortEvent,
    SortEventWithTag,
    SortStart,
    SortStartHandler,
    WrappedComponent
} from 'react-sortable-hoc'
import {getConfigForPath, isCurrentPathOkForConfig, sortKeys} from './treeUtil'
import {Drag} from '../Drag/Drag'
import {isDragHandle} from '../Drag/DragHandle'

export interface IObjectsToAdd {
    object: {}
    name: string
}

export interface IAddablePathConfig {
    path: IObjectPath
    options?: {
        limit?: number
        // plan object array of plan objects ane name,
        // or a function that returns a plan  object that should be added

        object?: {} | IObjectsToAdd[] | ((pathIn: IObjectPath) => {})
        modifiableFields?: Object[]
        showAddButton?: boolean
        onResolvePath?: (pathIn: IObjectPath) => IObjectPath
    }
}

export interface IDeletablePathConfig {
    path: IObjectPath
    options?: {
        onResolvePath?: (pathIn: IObjectPath) => IObjectPath
    }
}

export interface INonDragPathConfig {
    path: IObjectPath
    options?: {}
}

export interface IFieldTypePathConfig {
    path: IObjectPath
    options?: {fieldType: IFieldDataType}
}

export interface IObjectToPrimitivePathConfig {
    path: IObjectPath
    options?: {}
}

export interface IEditableNodesConfig {
    path: IObjectPath
    options?: {}
}

export interface IIgnoreKeysConfig {
    path: IObjectPath
}

/*Example of config
const x: IAddablePathConfig = {path: ['link'], options: {unique: true}}
const y: IAddablePathConfig[] = [
    {path: ['link'], options: {unique: true}},
    {path: ['link'], options: {unique: true}}
]*/

export interface IProps {
    addable?: IAddablePathConfig[]
    deletable?: IDeletablePathConfig[]
    typeable?: IFieldTypePathConfig[]
    // if not given all nodes and leaves are draggable,
    // when given drag is only turned //off/on according to this config
    nonDragable?: INonDragPathConfig[]
    objectToPrimitivePaths?: IObjectToPrimitivePathConfig[]
    collapse?: IEditableNodesConfig[]
    ignoreKeys?: IIgnoreKeysConfig[]
    // will make a leaf instaed of a node when when there is one
    // key and value and the value is a primative
    // {obj: 'xyz | 234 }
    collapseSingle?: boolean
    /* a  json object  that you dont want to build a node for
    and just build a leaf for its value.
     eg given this json
     "image": { > object value
        "src": "dino_omicevic.png" > primitive value
     },
     when imagesPaths is set to [['image']]
     A node will not be made for image
     but a leaf will be made for src

    */

    imagesPaths?: any[][]
    data: object[]
    nodeKeyForObjectsAndArrays?: string[]

    onUpdate: (text: string, objectPath: IObjectPath) => void
    onAdd?: (jsonObject: object, path: IObjectPath) => void
    onDelete?: (path: IObjectPath) => void

    projectUploadFolder: string

    assetDirectory?: string
    skipNode?: string
    onMoveNodeOrLeafTo: IMoveNodeOrLeafToMethod
    orderKey?: string
}

interface IState {
    isDirty: boolean
}

/*
       json object in
       1. loop object keys.
       2. build node from key name.
       3. get value from key:
       4. if value is primitive build leaf
       5. if value is object repeat step 1
       6. if value is array loop array
           6.1 if value is primitive build leaf
           6.2 if value is object repeat 1
           6.3 if value is array repeat 6
 */

class Tree extends React.Component<IProps, IState> {
    static contextType = MainContext
    shouldCancelDrag: boolean
    private dragULPointer: RefObject<HTMLUListElement>

    constructor(props) {
        super(props)
        this.dragULPointer = React.createRef()
        this.state = {isDirty: false}
        this.shouldCancelDrag = true
    }

    componentDidMount = () =>
        this.dragULPointer.current.addEventListener('mousedown', this.handleMainContainerMouseDown)

    componentWillUnmount = () =>
        this.dragULPointer.current.removeEventListener('mousedown', this.handleMainContainerMouseDown)

    // the drag handle is a material ui icon and its converting the class name to an object
    // if the user clicks the drag handle then drag is allowed
    handleMainContainerMouseDown = (event) => (this.shouldCancelDrag = !isDragHandle(event.target as HTMLElement))

    render = () => {
        return <ul className="tree tree_group">{this.makeTree(this.props.data, [])}</ul>
    }

    getOrderedKeys = (object: any): (string | number)[] => {
        const keys = Object.keys(object)
        const {orderKey} = this.props
        if (!orderKey) {
            return keys
        }
        const fieldOrder: IDefaultFieldOrder[] = object[orderKey]
        if (fieldOrder) {
            return sortKeys(keys, fieldOrder)
        }
        return keys
    }

    makeTree = (object: any, currentPath: any[]) => this.getNodesOrLeaves(object, currentPath)

    getNodesOrLeaves = (object: [] | object, currentPath: IObjectPath) => {
        const getItems = (isDragItems: boolean) => {
            return this.getOrderedKeys(object).map((key: string, reactKey) => {
                return isDragItems ? (
                    this.getNodeOrLeaf(object, currentPath, key, reactKey)
                ) : (
                    <li key={key + '-' + reactKey}>{this.getNodeOrLeaf(object, currentPath, key, reactKey)}</li>
                )
            })
        }

        if (this.getIsDraggablePath(currentPath)) {
            return this.makeDragList(currentPath, getItems(true))
        }

        return getItems(false)
    }

    /*
     * makes one node for the key and determines the value type
     * if the value is a simple primitive ( number , string or boolean )
     * a leaf is made
     * if the value type is a object , this method is called again recursively
     * if the value is an array the array is walked and each value is chcked
     *    if its an object this method is called again recursively
     *    if the value is a simple primitive ( number , string or boolean ) a leaf is made
     *    if its an array a node is made an the array is walked again recursively
     *  the currentPath is keep track of and is passed to event handlers,
     *  so the consumer can easily determine what node or leaf triggered the event
     */

    getNodeOrLeaf = (object: any, currentPath: any[], key: string, reactKey: number) => {
        if (getConfigForPath(currentPath.concat(this.getNodePathKey(key)), this.props.ignoreKeys)) {
            // && this.props.ignoreKeys.some((k) => k === key)
            return <Fragment key={'skipped_' + reactKey}> </Fragment>
        }

        let nodeToLeaf = null
        // eg image.src to image, useful for only showing image with no src node
        if (getConfigForPath(currentPath, this.props.objectToPrimitivePaths)) {
            // Object.values(object)[0] === Object.values([CURRENT OBJECT] [LEAF],
            // the RTLeaf is a primitive
            nodeToLeaf = Object.values(object)[0]
        }

        const elementPath = currentPath.concat(this.getNodePathKey(key))
        const nodeName = this.getNodeName(object[key], key)

        //  dont build a node for skipped or converted nodes
        if (this.props.skipNode === nodeName || nodeToLeaf) {
            return <li key={reactKey + key}>{this.testThenMake(object[key], elementPath, undefined, reactKey)}</li>
        }

        // todo refactor to use collapse
        // this leaf has been made on an editable node,
        // it can be skipped, we dont want a double up
        if (isPrimitive(object[key]) && this.isKeyOneOfNodeKeysForObjectsAndArrays(key)) {
            return <Fragment key={'skipped_' + key}> </Fragment>
        }

        if (getConfigForPath(currentPath, this.props.collapse)) {
            return <Fragment key={'skipped_' + key}> </Fragment>
        }

        if (getConfigForPath(elementPath, this.props.collapse)) {
            const leafValue = object[key]
            return this.makeLeaf(leafValue, elementPath, false, key)
        }

        // todo refactor
        let nodeEditableLeafPath = this.getNodeEditableLeafPath(object[key])
        // these fields are needed in the node just in case it needs to build
        // a editable node
        let leafValue: string = null
        if (nodeEditableLeafPath) {
            leafValue = object[key][nodeEditableLeafPath]
        }

        // objects value

        // children are needed when the node is editable, as it needs to
        // only show the add button if the child limit has not been reached
        // children are also needed if the options allow a child to be added
        // to the node

        return (
            /*NOTE Drag will make an li here , if no drag replace <> with <li>*/
            <>
                {this.makeNode(
                    nodeName,
                    elementPath,
                    nodeEditableLeafPath,
                    leafValue,
                    this.getNodeChildrenKeys(object, key),
                    reactKey
                )}
                <ul className="nested tree_group">
                    {this.testThenMake(object[key], elementPath, undefined, reactKey)}
                </ul>
            </>
        )
    }

    testThenMake = (
        object: [] | Object | string | number,
        currentPath: IObjectPath,
        parentIsArray: boolean = false,
        reactKey: string | number
    ) => {
        if (getConfigForPath(currentPath, this.props.ignoreKeys)) {
            // && this.props.ignoreKeys.some((k) => k === key)
            return <Fragment key={'skipped_' + reactKey}> </Fragment>
        }

        // if this object is in an array and it only has on key and value
        // that is a primitive make a leaf not the object
        if (this.props.collapseSingle && Object.keys(object).length === 1 && isPrimitive(Object.values(object)[0])) {
            const leafValue = Object.values(object)[0]
            const leafLabel = Object.keys(object)[0]
            const leafPath = currentPath.concat(leafLabel)
            return this.makeLeaf(leafValue, leafPath, false, null)
        }

        if (isPrimitive(object)) {
            return this.makeLeaf(object as string, currentPath)
        }
        if (this.isArray(object)) {
            return this.loopArray(object, currentPath, reactKey)
        }

        return this.startProcessObject(object as Object, parentIsArray, currentPath, reactKey)
    }

    startProcessObject = (
        object: [] | object,
        parentIsArray: boolean,
        currentPath: IObjectPath,
        reactKey: string | number
    ) => {
        const nodeName = this.getNodeName(object)
        const nodeEditableLeafPath = this.getNodeEditableLeafPath(object)
        let leafValue: string = null
        if (nodeEditableLeafPath) {
            leafValue = object[nodeEditableLeafPath]
        }

        /* if (Object.keys(object).length === 1) {
            const leafValue = object[key]
            return this.makeLeaf(leafValue, elementPath, false, key)
        }*/

        return parentIsArray ? (
            <Fragment key={currentPath.toString() + reactKey}>
                {this.makeNode(
                    nodeName,
                    currentPath,
                    nodeEditableLeafPath,
                    leafValue,
                    this.getNodeChildrenKeys(object, nodeName),
                    reactKey
                )}
                {/*if  "nested active" here it will be expanded on make*/}
                <ul className="nested tree_group">{this.getNodesOrLeaves(object, currentPath)}</ul>
            </Fragment>
        ) : (
            this.getNodesOrLeaves(object, currentPath)
        )
    }

    getNodeChildrenKeys = (object: [] | object, key: string | number) => {
        if (!Array.isArray(object)) {
            return Object.keys(object)
        }
        const objectInArray = (object as any[])[key]
        return Object.keys(objectInArray)
    }

    getIsDraggablePath = (currentPath: IObjectPath): boolean => {
        let isDraggablePath: boolean = true
        if (getConfigForPath(currentPath, this.props.nonDragable)) {
            isDraggablePath = false
        }
        return isDraggablePath
    }
    // todo refactor
    isKeyOneOfNodeKeysForObjectsAndArrays = (key: string) =>
        this.props.nodeKeyForObjectsAndArrays && this.props.nodeKeyForObjectsAndArrays.some((k) => k === key)

    loopArray = (array, currentPath: IObjectPath, reactKey: string | number) => {
        const getItems = (isDragItems: boolean) => {
            return array.map((object, arrayIndex) => {
                const currentPathWithArrayIndexAppended = currentPath.concat(arrayIndex)
                return isDragItems ? (
                    <Fragment key={currentPath + '-' + (arrayIndex as string) + reactKey}>
                        {this.testThenMake(object, currentPathWithArrayIndexAppended, true, reactKey)}
                    </Fragment>
                ) : (
                    <li key={currentPath + '-' + (arrayIndex as string) + reactKey}>
                        {this.testThenMake(object, currentPathWithArrayIndexAppended, true, reactKey)}
                    </li>
                )
            })
        }

        if (this.getIsDraggablePath(currentPath)) {
            return this.makeDragList(currentPath, getItems(true))
        }

        return getItems(false)
    }

    makeDragList = (currentPath: IObjectPath, items: any[]) => (
        <Drag
            ref={this.dragULPointer}
            // @ts-ignore
            helperClass="drag_handle"
            shouldCancelStart={(event: SortEvent | SortEventWithTag) => {
                // console.log('shouldCancelDrag=' + this.shouldCancelDrag)
                if (this.shouldCancelDrag) {
                    return true
                }
                return false
            }}
            items={items}
            /* onSortEnd={({oldIndex: fromIndex, newIndex: toIndex}) => {
                 this.props.onMoveNodeOrLeafTo(fromIndex, toIndex, currentPath)
             }}*/
            onSortEnd={({oldIndex: fromInex, newIndex: toIndex, nodes, collection}, event: SortEvent) => {
                // @ts-ignore
                const from = nodes[fromInex].node.querySelector('span.node.node')
                // @ts-ignore
                const to = nodes[toIndex].node.querySelector('span.node.node')
                if (from !== null && to !== null) {
                    this.props.onMoveNodeOrLeafTo(fromInex, toIndex, currentPath, from.innerText, to.innerText)
                } else {
                    throw new Error(
                        'could not get span.node.node of nodes[' +
                            fromInex +
                            '] nodes[' +
                            fromInex +
                            ']  or  + nodes[' +
                            toIndex +
                            ']'
                    )
                }
            }}
        />
    )

    makeNode = (
        nodeName: string,
        currentPath: IObjectPath,
        nodeEditableLeafPath: string,
        leafValue: string,
        childKeys: (string | object)[],
        reactKey: string | number
    ) => {
        return (
            <>
                <TreeNode
                    reactKey={reactKey}
                    nodeName={nodeName}
                    currentPath={currentPath}
                    nodeEditableLeafPath={nodeEditableLeafPath}
                    leafValue={leafValue}
                    childKeys={childKeys}
                    addable={this.props.addable}
                    deletable={this.props.deletable}
                    onAdd={this.props.onAdd}
                    onDelete={this.props.onDelete}
                    toggle={this.toggle}
                    makeLeaf={this.makeLeaf}
                    makeDragHandle={this.getIsDraggablePath(currentPath)}
                />
                {this.context.isDebug && <span className="debug">'NPATH=' {currentPath} </span>}
            </>
        )
    }

    makeLeaf = (
        value: string,
        currentPath: IObjectPath,
        makeDragHandle: boolean = this.getIsDraggablePath(currentPath),
        label?: string
    ) => {
        const path = [...currentPath]
        const canDelete = this.props.onDelete && isCurrentPathOkForConfig(path, undefined, this.props.deletable)
        const imagePath = this.isImagePath(path) ? this.getImagePath(value) : undefined
        const dataTypePathConfig = getConfigForPath(currentPath, this.props.typeable)
        const leafType = dataTypePathConfig ? (dataTypePathConfig as IFieldTypePathConfig).options.fieldType : undefined

        /*if (leafType && leafType === 'readonly') {
            console.log('readonly path found for path ' + currentPath)
        }*/

        const onDelete = canDelete
            ? () => {
                  if (this.context.isDebug) {
                      console.info('currentPath is ' + currentPath)
                  }
                  const config = getConfigForPath(currentPath, this.props.deletable)
                  const deleableConfig = config as IDeletablePathConfig
                  const onResolveDeletePath =
                      deleableConfig && deleableConfig.options && deleableConfig.options.onResolvePath
                  this.props.onDelete(onResolveDeletePath ? onResolveDeletePath(currentPath) : currentPath)
              }
            : undefined

        return (
            <>
                <TreeLeaf
                    type={leafType}
                    makeDragHandle={makeDragHandle}
                    onUpdate={(text: string) => this.props.onUpdate(text, currentPath)}
                    onDelete={onDelete}
                    imagePath={imagePath}
                    value={value}
                    uploadFolder={this.props.projectUploadFolder}
                    label={label}
                />
                {this.context.isDebug && <span className="debug">'PATH=' {currentPath} </span>}
            </>
        )
    }

    getImagePath = (image: string): string => '/' + this.props.assetDirectory + '/' + image

    getNodeName = (object, alternativeName = 'opener') => {
        const propertyOfObject = this.getNodeEditableLeafPath(object)
        if (propertyOfObject) {
            return propertyOfObject
        } else {
            return alternativeName
        }
    }

    isNodeEditableType = (object: any): boolean => this.getNodeEditableLeafPath(object) !== null

    getNodeEditableLeafPath = (object: any): string | null => {
        if (!this.props.nodeKeyForObjectsAndArrays) {
            return null
        }

        return this.props.nodeKeyForObjectsAndArrays.find((key) => object[key] !== undefined)
    }

    isArray = (value) => Array.isArray(value)

    isImagePath = (path: any[]): boolean => {
        let isImagePath = false
        if (this.props.assetDirectory === undefined) {
            isImagePath = false
        }

        this.props.imagesPaths.forEach((pathIn) => {
            if (isEqual(path, pathIn)) {
                isImagePath = true
            }
        })
        const pathAsString = path.toString()
        this.props.imagesPaths.forEach((p) => {
            if (pathAsString.indexOf(p.toString()) !== -1) {
                isImagePath = true
            }
        })

        return isImagePath
    }

    getNodePathKey = (key: string) => (isNaN(Number(key)) ? key : parseInt(key, 10))

    toggle = (event) => {
        const nested = event.target.parentElement.querySelector('.nested')
        if (nested) {
            nested.classList.toggle('active')
        }

        event.target.classList.toggle('node-down')
    }
}

export default Tree
