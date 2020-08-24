import React from 'react'
import './Tree.css'
import EditableLabel from '../EditableLabel/EditableLabel'
import {isEqual, cloneDeep} from 'lodash'
import TreeLeaf from './TreeLeaf/TreeLeaf'
import StaticBackEditor from '../../../context/StaticBackEditor'

export interface IProps {
    data: object[]
    nodeKeyForObjectsAndArrays: string
    ignoreKeys: string[]
    onUpdate: (text: string, objectPath: any[]) => void
    onDelete?: (path: any[]) => void
    deletableFields?: string[]
    readonlyPaths?: any[][]
    imagesPaths?: any[][]
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

    processObject = (object, currentPath: any[]) =>
        Object.keys(object).map((key, reactKey) => {
            if (this.props.ignoreKeys.some((k) => k === key)) {
                // cannot return <> here as key must be set
                return <span key={'skipped_' + key}> </span>
            }

            let nodeToLeaf = null
            // eg image.src to image, useful for only showing image with no src node
            if (this.isObjectToPrimitivePath(currentPath)) {
                nodeToLeaf = Object.values(object)[0]
            }

            const elementPath = currentPath.concat(this.getNodePathKey(key))

            if (nodeToLeaf) {
                return (
                    // since we converted the node to a leaf we dont need  <ul className="nested">
                    <li key={reactKey + key}>
                        {this.isPrimitive(object[key] || nodeToLeaf)
                            ? this.buildLeaf(nodeToLeaf || object[key], elementPath)
                            : this.isArray(object[key])
                            ? this.loopArray(object[key], elementPath)
                            : this.startProcessObject(object[key], false, elementPath)}
                    </li>
                )
            }

            return (
                <li key={reactKey + key}>
                    {this.buildNode(this.getOpenerName(object[key], key), elementPath)}
                    {/*if  "nested active" here it will it expanded*/}
                    <ul className="nested">
                        {this.isPrimitive(object[key])
                            ? this.buildLeaf(object[key], elementPath)
                            : this.isArray(object[key])
                            ? this.loopArray(object[key], elementPath)
                            : this.startProcessObject(object[key], false, elementPath)}
                    </ul>
                </li>
            )
        })

    /*
     *  if the parent is  an array a node is made for it and then the child object
     *  is processed
     */

    startProcessObject = (object, parentIsArray, currentPath: string[]) => {
        return parentIsArray ? (
            <li>
                {' '}
                {this.buildNode(this.getOpenerName(object), currentPath)}
                {/*if  "nested active" here it will be expanded on make*/}
                <ul className="nested">{this.processObject(object, currentPath)}</ul>
            </li>
        ) : (
            this.processObject(object, currentPath)
        )
    }

    loopArray = (array, elementPath: string[]) =>
        array.map((value, key) => (
            <div key={key + value}>
                {this.isPrimitive(value)
                    ? this.buildLeaf(value, elementPath.concat(key))
                    : this.isArray(value)
                    ? this.loopArray(value, elementPath.concat(key))
                    : this.startProcessObject(value, true, elementPath.concat(key))}
            </div>
        ))

    buildNode = (nodeName: string, currentPath: any[]) => (
        <>
            {this.isDeletable(currentPath) && (
                <button
                    className="editable_label_delete_button"
                    title="delete"
                    onClick={() => this.props.onDelete(currentPath)}>
                    X
                </button>
            )}

            <span
                className="caret node"
                onClick={(e) => {
                    this.toggle(e)
                }}>
                {nodeName}
                {this.context.isDebug && <span className="debug">'PATH=' {currentPath} </span>}
            </span>
        </>
    )

    getImagePath = (image: string): string => '/' + this.props.imageDirectory + '/' + image

    buildLeaf = (value: string, currentPath: string[]) => {
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
                    onUpdate={(value: string) => this.props.onUpdate(value, currentPath)}
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

    getNodePathKey = (key: string) => (isNaN(Number(key)) ? key : parseInt(key, 10))

    getOpenerName = (object, alternativeName = 'opener') => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return object[this.props.nodeKeyForObjectsAndArrays]
        } else {
            return alternativeName
        }
    }

    toggle = (event) => {
        event.target.parentElement.querySelector('.nested').classList.toggle('active')
        event.target.classList.toggle('caret-down')
    }
}

export default Tree
