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
import {sortKeys} from './treeUtil'

export interface IAddablePathConfig {
    path: IObjectPath
    options?: {
        limit?: number
        objectToAdd?: {}
        modifiableFields?: Object[]
        showAddButton?: boolean
        onResolvePath?: (pathIn: IObjectPath) => IObjectPath
    }
}

/*Example of config
const x: IAddablePathConfig = {path: ['link'], options: {unique: true}}
const y: IAddablePathConfig[] = [
    {path: ['link'], options: {unique: true}},
    {path: ['link'], options: {unique: true}}
]*/

export interface IProps {
    addablePathConfigs?: IAddablePathConfig[]
    readonlyPaths?: any[][]
    imagesPaths?: any[][]
    data: object[]
    nodeKeyForObjectsAndArrays?: string
    ignoreKeys?: string[]
    onUpdate: (text: string, objectPath: any[]) => void
    onAdd?: (jsonObject: object, path: IObjectPath[]) => void
    onDelete?: (path: any[]) => void

    projectUploadFolder: string
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

    objectToPrimitivePaths?: any[][]
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
        return <div>{this.makeTree(this.props.data, [])}</div>
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

    getNodesOrLeaves = (object: any, currentPath: any[]) => {
        // let propertyFrom
        return (
            <DragList
                helperClass="drag_handle"
                onSortStart={(sort: SortStart, event: SortEvent) => {
                    // @ts-ignore
                    // propertyFrom = event.target.parentNode.childNodes[2].lastChild.data
                }}
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
                    const from = nodes[fromInex].node.querySelector('span.caret.node')
                    // @ts-ignore
                    const to = nodes[toIndex].node.querySelector('span.caret.node')
                    if (from !== null && to !== null) {
                        console.log('from=' + from.innerText + '-' + fromInex + '  To=' + to.innerText + '-' + toIndex)
                        this.props.onMoveNodeOrLeafTo(fromInex, toIndex, currentPath, from.innerText, to.innerText)
                    } else {
                        console.error('wtf')
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
        if (this.props.ignoreKeys && this.props.ignoreKeys.some((k) => k === key)) {
            return <Fragment key={'skipped_' + reactKey}> </Fragment>
        }

        let nodeToLeaf = null
        // eg image.src to image, useful for only showing image with no src node
        if (this.isObjectToPrimitivePath(currentPath)) {
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

        // this leaf has been made on an editable node,
        // it can be skipped, we dont want a double up
        if (this.isPrimitive(object[key]) && key === this.props.nodeKeyForObjectsAndArrays) {
            return <Fragment key={'skipped_' + key}> </Fragment>
        }

        const nodeEditableLeafPath = this.getNodeEditableLeafPath(object[key])
        // these fields are needed in the node just in case it needs to build
        // a editable node
        let leafValue: string = null
        if (nodeEditableLeafPath) {
            leafValue = object[key][nodeEditableLeafPath]
        }

        // children are needed when the node is editable, as it needs to
        // only show the add button if the child limit has not been reached
        // children are also needed if the options allow a child to be added
        // to the node

        return (
            /*NOTE Drag will make an li here , if no drag replace <> with <li>*/
            <>
                {this.makeNode(nodeName, elementPath, nodeEditableLeafPath, leafValue, object, reactKey)}
                <ul className="nested">{this.testThenMake(object[key], elementPath, undefined, reactKey)}</ul>
            </>
        )
    }

    testThenMake = (object: any, elementPath: any[], parentIsArray: boolean = false, reactKey) => {
        if (this.isPrimitive(object)) {
            return this.makeLeaf(object, elementPath)
        }
        if (this.isArray(object)) {
            return this.loopArray(object, elementPath, reactKey)
        }

        return this.startProcessObject(object, parentIsArray, elementPath, reactKey)
    }

    startProcessObject = (object: {}, parentIsArray: boolean, currentPath: string[], reactKey: string | number) => {
        const nameName = this.getNodeName(object)
        const nodeEditableLeafPath = this.getNodeEditableLeafPath(object)
        let leafValue: string = null
        if (nodeEditableLeafPath) {
            leafValue = object[nodeEditableLeafPath]
        }

        return parentIsArray ? (
            <li>
                {' '}
                {this.makeNode(nameName, currentPath, nodeEditableLeafPath, leafValue, object, reactKey)}
                {/*if  "nested active" here it will be expanded on make*/}
                <ul className="nested">
                    <li>{this.getNodesOrLeaves(object, currentPath)}</li>
                </ul>
            </li>
        ) : (
            this.getNodesOrLeaves(object, currentPath)
        )
    }

    loopArray = (array, elementPath: string[], reactKey: string | number) => (
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
            items={array.map((object, key) => {
                // console.log('object=[' + object + '] key= [' + key + ']')
                if (key === this.props.nodeKeyForObjectsAndArrays) {
                    return <Fragment key={'skipped_' + reactKey + '-' + key} />
                }
                const currentPath = elementPath.concat(key)
                return <div key={key + reactKey}>{this.testThenMake(object, currentPath, true, reactKey)}</div>
            })}
            onSortEnd={({oldIndex: fromIndex, newIndex: toIndex}) => {
                this.props.onMoveNodeOrLeafTo(fromIndex, toIndex, elementPath)
            }}
        />
    )

    makeNode = (
        nodeName: string,
        currentPath: any[],
        nodeEditableLeafPath: string,
        leafValue: string,
        nodeJson: Object,
        reactKey: string | number
    ) => {
        return (
            <TreeNode
                reactKey={reactKey}
                nodeName={nodeName}
                currentPath={currentPath}
                nodeEditableLeafPath={nodeEditableLeafPath}
                leafValue={leafValue}
                nodeJson={nodeJson}
                addablePathConfigs={this.props.addablePathConfigs}
                onAdd={this.props.onAdd}
                isDeletable={this.isDeletable(currentPath)}
                onDelete={this.props.onDelete}
                toggle={this.toggle}
                makeLeaf={this.makeLeaf}
            />
        )
    }

    makeLeaf = (value: string, currentPath: string[], makeDragHandle: boolean = true) => {
        const path = cloneDeep(currentPath)
        const onDelete = this.isDeletable(path)
            ? () => {
                  if (this.context.isDebug) {
                      alert('currentPath is ' + currentPath)
                  }
                  this.props.onDelete(currentPath)
              }
            : undefined

        const imagePath = this.isImagePath(path) ? this.getImagePath(value) : undefined

        return (
            <>
                <TreeLeaf
                    makeDragHandle={makeDragHandle}
                    onUpdate={(text: string) => this.props.onUpdate(text, currentPath)}
                    onDelete={onDelete}
                    imagePath={imagePath}
                    value={value}
                    uploadFolder={this.props.projectUploadFolder}
                />
                {this.context.isDebug && <span className="debug">'PATH=' {currentPath} </span>}
            </>
        )
    }

    getImagePath = (image: string): string => '/' + this.props.imageDirectory + '/' + image

    getNodeName = (object, alternativeName = 'opener') => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return object[this.props.nodeKeyForObjectsAndArrays]
        } else {
            return alternativeName
        }
    }

    isNodeEditableType = (object) => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return true
        }
    }

    getNodeEditableLeafPath = (object) => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return this.props.nodeKeyForObjectsAndArrays
        }
    }

    isArray = (value) => Array.isArray(value)

    isPrimitive = (value): boolean => {
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    }

    isObjectToPrimitivePath = (path: any[]): boolean => {
        let isMergePath = false
        const objectToPrimitivePaths = this.props.objectToPrimitivePaths

        if (!objectToPrimitivePaths) {
            return false
        }
        this.props.objectToPrimitivePaths.forEach((pathIn) => {
            if (isEqual(path, pathIn)) {
                isMergePath = true
            }
        })
        const pathAsString = path.toString()
        this.props.objectToPrimitivePaths.forEach((p) => {
            if (pathAsString.indexOf(p.toString()) !== -1) {
                isMergePath = true
            }
        })

        return isMergePath
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

    isDeletable = (path: any[]): boolean => {
        let canDelete = true
        if (this.props.onDelete === undefined) {
            canDelete = false
        }
        // first level of sections can be deleted
        if (path.length === 1) {
            canDelete = true
        }

        const readonlyPaths = this.props.readonlyPaths
        if (!readonlyPaths) {
            return false
        }

        readonlyPaths.forEach((pathIn) => {
            if (isEqual(path, pathIn)) {
                canDelete = false
            }
        })
        const pathAsString = path.toString()
        readonlyPaths.forEach((p) => {
            if (pathAsString.indexOf(p.toString()) !== -1) {
                canDelete = false
            }
        })

        return canDelete
    }

    // TODO make other path methods like this
    isAddable = (currentPath: IObjectPath, childrenCount: number): boolean => {
        if (this.props.addablePathConfigs === undefined) {
            return false
        }

        for (let i = 0; i < this.props.addablePathConfigs.length; i++) {
            let userPath = cloneDeep(this.props.addablePathConfigs[i].path)
            // replace * in user path with actual value from path
            if (userPath.length === currentPath.length) {
                for (let j = 0; j < this.props.addablePathConfigs.length; j++) {
                    if (userPath[j] === Constants.wildcard) {
                        userPath[j] = currentPath[j]
                    }
                }

                if (!isEqual(currentPath, userPath)) {
                    continue
                }

                if (
                    this.props.addablePathConfigs[i].options &&
                    this.props.addablePathConfigs[i].options.limit &&
                    childrenCount > this.props.addablePathConfigs[i].options.limit
                ) {
                    continue
                }

                return true
            }
        }

        return false
    }

    getNodePathKey = (key: string) => (isNaN(Number(key)) ? key : parseInt(key, 10))

    doesHaveNodeKeyForObjectsAndArrays = (object) => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return true
        } else {
            return false
        }
    }

    toggle = (event) => {
        event.target.parentElement.querySelector('.nested').classList.toggle('active')
        event.target.classList.toggle('caret-down')
    }
}

const DragList = SortableContainer(({items}) => {
    return (
        <ul id="myUL" className="DragList">
            {items.map((value, index) => {
                return <DragListItem key={'item-' + index + '-' + value} index={index} value={value} />
            })}
        </ul>
    )
})

const DragListItem = SortableElement(({value}) => <li className="drag_item">{value}</li>)

export default Tree
