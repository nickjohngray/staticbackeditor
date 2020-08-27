import React from 'react'
import './Tree.css'
import {isEqual, cloneDeep} from 'lodash'
import TreeLeaf from './TreeLeaf/TreeLeaf'
import StaticBackEditor from '../../../context/StaticBackEditor'
import {Constants} from '../../../util'
import {IPath} from '../../../../shared/typings'
import TreeNode from './TreeNode/TreeNode'

export interface IAddablePathConfig {
    path: IPath
    options?: {
        limit?: number
        objectToAdd?: {}
        modifiableFields?: Object[]
        showAddButton?: boolean
        onResolvePath?: (pathIn: IPath) => IPath
    }
}

/*Example of config
const x: IAddablePathConfig = {path: ['link'], options: {unique: true}}
const y: IAddablePathConfig[] = [
    {path: ['link'], options: {unique: true}},
    {path: ['link'], options: {unique: true}}
]*/

export interface IProps {
    addablePathConfigs: IAddablePathConfig[]
    readonlyPaths?: any[][]
    imagesPaths?: any[][]
    data: object[]
    nodeKeyForObjectsAndArrays?: string
    ignoreKeys?: string[]
    onUpdate: (text: string, objectPath: any[]) => void
    onAdd?: (jsonObject: object, path: IPath[]) => void
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
        return (
            <div>
                <ul id="myUL">{this.processObject(this.props.data, [])}</ul>
            </div>
        )
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

    processObject = (object, currentPath: any[]) =>
        Object.keys(object).map((key, reactKey) => {
            if (this.props.ignoreKeys && this.props.ignoreKeys.some((k) => k === key)) {
                // cannot return <> here as key must be set
                return <span key={'skipped_' + key}> </span>
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
                return <li key={reactKey + key}>{this.testThenMake(object[key], elementPath)}</li>
            }

            // this leaf has been made on an editable node,
            // it can be skipped, we dont want a double up
            if (this.isPrimitive(object[key]) && key === this.props.nodeKeyForObjectsAndArrays) {
                return <span key={'skipped_' + key}> </span>
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
            const children = Object.values(object)

            return (
                <li key={reactKey + key}>
                    {this.makeNode(nodeName, elementPath, nodeEditableLeafPath, leafValue, object)}
                    <ul className="nested">{this.testThenMake(object[key], elementPath)}</ul>
                </li>
            )
        })

    startProcessObject = (object: {}, parentIsArray: boolean, currentPath: string[]) => {
        const nameName = this.getNodeName(object)
        const nodeEditableLeafPath = this.getNodeEditableLeafPath(object)
        let leafValue: string = null
        if (nodeEditableLeafPath) {
            leafValue = object[nodeEditableLeafPath]
        }

        return parentIsArray ? (
            <li>
                {' '}
                {this.makeNode(nameName, currentPath, nodeEditableLeafPath, leafValue, object)}
                {/*if  "nested active" here it will be expanded on make*/}
                <ul className="nested">{this.processObject(object, currentPath)}</ul>
            </li>
        ) : (
            this.processObject(object, currentPath)
        )
    }
    loopArray = (array, elementPath: string[]) =>
        array.map((object, key) => {
            if (key === this.props.nodeKeyForObjectsAndArrays) {
                return <></>
            }
            const currentPath = elementPath.concat(key)
            return <div key={key + object}>{this.testThenMake(object, currentPath, true)}</div>
        })

    testThenMake = (object: any, elementPath: any[], parentIsArray: boolean = false) => {
        if (this.isPrimitive(object)) {
            return this.makeLeaf(object, elementPath)
        }
        if (this.isArray(object)) {
            return this.loopArray(object, elementPath)
        }

        return this.startProcessObject(object, parentIsArray, elementPath)
    }

    makeNode = (
        nodeName: string,
        currentPath: any[],
        nodeEditableLeafPath: string,
        leafValue: string,
        nodeJson: Object
    ) => {
        return (
            <TreeNode
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

    getImagePath = (image: string): string => '/' + this.props.imageDirectory + '/' + image

    makeLeaf = (value: string, currentPath: string[], makeLeafWarpper: boolean = true) => {
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
                    makeWrapper={makeLeafWarpper}
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

    isArray = (value) => Array.isArray(value)

    isPrimitive = (value): boolean => {
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    }

    isObjectToPrimitivePath = (path: any[]): boolean => {
        let isMergePath = false
        if (path.toString().indexOf('link') !== -1) {
            console.log(path + ' ====' + this.props.objectToPrimitivePaths)
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

        this.props.readonlyPaths.forEach((pathIn) => {
            if (isEqual(path, pathIn)) {
                canDelete = false
            }
        })
        const pathAsString = path.toString()
        this.props.readonlyPaths.forEach((p) => {
            if (pathAsString.indexOf(p.toString()) !== -1) {
                canDelete = false
            }
        })

        return canDelete
    }

    // TODO make other path methods like this
    isAddable = (currentPath: IPath, childrenCount: number): boolean => {
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

export default Tree
