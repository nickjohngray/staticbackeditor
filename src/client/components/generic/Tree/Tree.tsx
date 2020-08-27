import React from 'react'
import './Tree.css'
import {isEqual, cloneDeep} from 'lodash'
import TreeLeaf from './TreeLeaf/TreeLeaf'
import StaticBackEditor from '../../../context/StaticBackEditor'
import {Constants} from '../../../util'
import {IPath} from '../../../../shared/typings'

const obj = {
    link: 'https://strengthpitotara.co.nz',
    image: {
        src: 'man.png'
    },
    header: 'Click to edit name',
    list: ['Click to edit list item'],
    body: 'Click to edit body'
}

interface IAddablePathConfig {
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
                return <li key={reactKey + key}>{this.testThenMake(object, key, elementPath)}</li>
            }

            // this leaf has been made on an editable node,
            // it can be skipped, we dont want a double up
            if (this.isPrimitive(object[key]) && key === this.props.nodeKeyForObjectsAndArrays) {
                return <></>
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
                    <ul className="nested">{this.testThenMake(object, key, elementPath)}</ul>
                </li>
            )
        })

    testThenMake = (object: any, key: string | number, elementPath: any[]) => {
        if (this.isPrimitive(object[key])) {
            return this.makeLeaf(object[key], elementPath)
        }
        if (this.isArray(object[key])) {
            return this.loopArray(object[key], elementPath)
        }

        return this.startProcessObject(object[key], false, elementPath)
    }

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
        array.map((value, key) => {
            if (key === this.props.nodeKeyForObjectsAndArrays) {
                return <></>
            }
            return (
                // todo refactor this
                <div key={key + value}>
                    {this.isPrimitive(value)
                        ? this.makeLeaf(value, elementPath.concat(key))
                        : this.isArray(value)
                        ? this.loopArray(value, elementPath.concat(key))
                        : this.startProcessObject(value, true, elementPath.concat(key))}
                </div>
            )
        })

    makeNode = (nodeName: string, currentPath: any[], nodeEditableLeafPath: string, leafValue, nodeJson: Object) => {
        const makeLeaf = () => this.makeLeaf(leafValue, cloneDeep(currentPath).concat(nodeEditableLeafPath))

        const makeDeleteButton = () => {
            return (
                <button
                    className="editable_label_delete_button"
                    title="delete"
                    onClick={() => this.props.onDelete(currentPath)}>
                    X
                </button>
            )
        }

        const makeAddButton = (userObjectToAddWhenAddIsClicked: {}, onResolvePath: (pathIn: IPath) => IPath) => {
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

        const makeModifiableFieldsButtons = (configFieldKeys: Object[], currentFieldJsonObjects: Object[]) => {
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

        const config: IAddablePathConfig = this.getConfigForPath(currentPath, this.props.addablePathConfigs)
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
                {this.isDeletable(currentPath) && makeDeleteButton()}
                {showAddButton &&
                    this.isOk(currentPath, childrenCount, this.props.addablePathConfigs) &&
                    makeAddButton(objectToAdd, onResolvePath)}
                {modifiableFields && makeModifiableFieldsButtons(modifiableFields, currentFields)}
                <span
                    className="caret node"
                    onClick={(e) => {
                        this.toggle(e)
                    }}>
                    {nodeEditableLeafPath ? makeLeaf() : nodeName}
                    {this.context.isDebug && <span className="debug">'Node PATH=' {currentPath} </span>}
                </span>
            </>
        )
    }

    getImagePath = (image: string): string => '/' + this.props.imageDirectory + '/' + image

    makeLeaf = (value: string, currentPath: string[]) => {
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

    isOk = (currentPath: IPath, childrenCount: number, config: IAddablePathConfig[]): boolean => {
        if (config === undefined) {
            return false
        }
        // todo refactor this
        for (let i = 0; i < config.length; i++) {
            let userPath = cloneDeep(config[i].path)
            // replace * in user path with actual value from path
            if (userPath.length === currentPath.length) {
                for (let j = 0; j < config.length; j++) {
                    if (userPath[j] === Constants.wildcard) {
                        userPath[j] = currentPath[j]
                    }
                }

                if (!isEqual(currentPath, userPath)) {
                    continue
                }

                if (config[i].options && config[i].options.limit && childrenCount > config[i].options.limit) {
                    continue
                }

                return true
            }
        }

        return false
    }

    getConfigForPath = (currentPath: IPath, configs: IAddablePathConfig[]): IAddablePathConfig | null => {
        if (configs === undefined) {
            return null
        }

        for (let i = 0; i < configs.length; i++) {
            let userPath = cloneDeep(configs[i].path)
            // replace * in user path with actual value from path
            if (userPath.length === currentPath.length) {
                for (let j = 0; j < configs.length; j++) {
                    if (userPath[j] === Constants.wildcard) {
                        userPath[j] = currentPath[j]
                    }
                }
            }
            if (isEqual(currentPath, userPath)) {
                return configs[i]
            }
        }

        return null
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
