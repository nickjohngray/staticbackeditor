import React, {Fragment} from 'react'
import './Tree.css'
import {isEqual, cloneDeep} from 'lodash'
import TreeLeaf from './TreeLeaf/TreeLeaf'
import StaticBackEditor from '../../../context/StaticBackEditor'
import {Constants} from '../../../util'
import {IDefaultFieldOrder, IMoveNodeOrLeafToMethod, IObjectPath, ISection} from '../../../../shared/typings'
import TreeNode from './TreeNode/TreeNode'
import {
    SortableContainer,
    SortableElement,
    SortEvent,
    SortEventWithTag,
    SortStart,
    SortStartHandler
} from 'react-sortable-hoc'
import {getConfigForPath, isCurrentPathOkForConfig, sortKeys} from './treeUtil'

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
    options?: {fieldType: 'string' | 'number' | 'readonly'}
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

    imageDirectory?: string
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
    static contextType = StaticBackEditor

    constructor(props) {
        super(props)
        this.state = {isDirty: false}
    }

    render = () => {
        return <ul className="tree tree_group">{this.makeTree(this.props.data, [])}</ul>
    }

    getOrderedKeys = (object: any) => {
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
        const isDraggablePath = this.getIsDraggablePath(currentPath)
        // if not draggable
        if (!isDraggablePath) {
            /* if (true) {*/
            return this.getOrderedKeys(object).map((key, reactKey) => (
                // todo is li needed here, dont think so tested it has no effect on view
                <li key={key + '-' + reactKey}>{this.getNodeOrLeaf(object, currentPath, key, reactKey)}</li>
            ))
        }
        return (
            <DragList
                helperClass="drag_handle"
                shouldCancelStart={(event: SortEvent | SortEventWithTag) => {
                    if ((event as SortEventWithTag).target.tagName === 'DIV') {
                        return false
                    }
                    return true
                }}
                items={this.getOrderedKeys(object).map((key, reactKey) => {
                    return this.getNodeOrLeaf(object, currentPath, key, reactKey)
                })}
                onSortEnd={({oldIndex: fromInex, newIndex: toIndex, nodes, collection}, event: SortEvent) => {
                    // @ts-ignore
                    const from = nodes[fromInex].node.querySelector('span.node.node')
                    // @ts-ignore
                    const to = nodes[toIndex].node.querySelector('span.node.node')
                    if (from !== null && to !== null) {
                        console.log('from=' + from.innerText + '-' + fromInex + '  To=' + to.innerText + '-' + toIndex)
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
    }
    /*  Object.keys(object).map((key, reactKey) => {
            return this.getNodeOrLeaf(object, currentPath, key, reactKey)
        })*/

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
            // the Leaf is a primitive
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
        if (this.isPrimitive(object[key]) && this.isKeyOneOfNodeKeysForObjectsAndArrays(key)) {
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
        if (
            this.props.collapseSingle &&
            Object.keys(object).length === 1 &&
            this.isPrimitive(Object.values(object)[0])
        ) {
            const leafValue = Object.values(object)[0]
            const leafLabel = Object.keys(object)[0]
            const leafPath = currentPath.concat(leafLabel)
            return this.makeLeaf(leafValue, leafPath, false, null)
        }

        if (this.isPrimitive(object)) {
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
        if (!this.getIsDraggablePath(currentPath)) {
            /* if (true) {*/
            return array.map((object, arrayIndex: string | number) => {
                const currentPathWithArrayIndexAppended = currentPath.concat(arrayIndex)
                // MAYBE
                // li below is needed here to show items in vertical list
                // if drag is true the drag will make this li
                return (
                    <li key={currentPath + '-' + (arrayIndex as string) + reactKey}>
                        {this.testThenMake(object, currentPathWithArrayIndexAppended, true, reactKey)}
                    </li>
                )
            })
        }

        return (
            <DragList
                helperClass="drag_handle"
                shouldCancelStart={(event: SortEvent | SortEventWithTag) => {
                    if ((event as SortEventWithTag).target.tagName === 'DIV') {
                        return false // the drag handle is defined in a div
                    }
                    // cancel this drag event for all other tag elements,
                    // like span, button and link, these are used for
                    // other things
                    return true
                }}
                items={array.map((object, arrayIndex) => {
                    const currentPathWithArrayIndexAppended = currentPath.concat(arrayIndex)
                    return (
                        <Fragment key={arrayIndex + reactKey}>
                            {this.testThenMake(object, currentPathWithArrayIndexAppended, true, reactKey)}
                        </Fragment>
                    )
                })}
                onSortEnd={({oldIndex: fromIndex, newIndex: toIndex}) => {
                    this.props.onMoveNodeOrLeafTo(fromIndex, toIndex, currentPath)
                }}
            />
        )
    }

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

    getImagePath = (image: string): string => '/' + this.props.imageDirectory + '/' + image

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

    isPrimitive = (value): boolean => {
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    }

    isImagePath = (path: any[]): boolean => {
        let isImagePath = false
        if (this.props.imageDirectory === undefined) {
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

const DragList = SortableContainer(({items}) => {
    return (
        <ul className="tree_group drag_list">
            {items.map((value, index) => {
                return <DragListItem key={'item-' + index + '-' + value} index={index} value={value} />
            })}
        </ul>
    )
})

const DragListItem = SortableElement(({value}) => {
    return <li className="drag_item">{value}</li>
})

export default Tree
