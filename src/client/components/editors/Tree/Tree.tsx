import React, {lazy} from 'react'
import './Tree.css'
import EditableLabel from '../EditableLabel/EditableLabel'
import {isEqual} from 'lodash'
import {LazyLoadImage} from 'react-lazy-load-image-component'

export interface IProps {
    data: object[]
    nodeKeyForObjectsAndArrays: string
    skipKey: string
    onUpdate: (text: string, path: any[]) => void
    onDelete?: (path: any[]) => void
    deletableFields?: string[]
    readonlyPaths?: any[][]
    imagesPaths?: any[][]
    isDebug?: boolean
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
    constructor(props) {
        super(props)
        this.state = {isDirty: false}
    }

    render = () => (
        <div>
            <ul id="myUL">{this.processObject(this.props.data, [])}</ul>
        </div>
    )

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
            if (key === this.props.skipKey) {
                return <span key={'skipped_' + key}> </span>
            }

            const elementPath = currentPath.concat(this.getNodePathKey(key))

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
                {this.props.isDebug && 'PATH=' + currentPath}
            </span>
        </>
    )

    getImage2 = (image: string) => {
        const path = require('./../../../../../easyecom/src/images/' + image)
        console.log(path.default)
        return <img src={'/' + path.default} />
    }
    getImage = (image: string) => (
        <LazyLoadImage height={100} src={'/' + this.props.imageDirectory + '/' + image} width={100} />
    )

    buildLeaf = (value: string, currentPath: string[]) => {
        if (this.isImagePath(currentPath)) {
            return this.getImage(value)
        }
        return (
            <li className="leaf">
                <EditableLabel
                    onDelete={this.isDeletable(currentPath) ? () => this.props.onDelete(currentPath) : undefined}
                    isDeleteable={this.isDeletable(currentPath)}
                    elementPath={currentPath}
                    onUpdate={(text) => {
                        this.props.onUpdate(text, currentPath)
                    }}
                    value={value}
                />{' '}
                {this.props.isDebug && 'PATH=' + currentPath}
            </li>
        )
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
