import * as React from 'react'
import './Tree.css'
import EditableLeaf from './EditableLeaf/EditableLeaf'
import {isNumber} from 'lodash'

export interface IProps {
    data: object[]
    nodeKeyForObjectsAndArrays: string
    skipKey: string
    onUpdate: (text: string, path: any[]) => void
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
    // to do get rid of any should be string or number array

    processObject = (object, currentPath: any[]) =>
        Object.keys(object).map((key, reactKey) => {
            if (key === this.props.skipKey) {
                return <> </>
            }

            const elementPath = currentPath.concat(this.getNodePathKey(key))
            return (
                <li key={reactKey + key}>
                    {this.buildNode(this.getOpenerName(object[key], key))}
                    {/*if  "nested active" here it will it expanded*/}
                    <ul className="nested">
                        {this.isPrimitive(object[key])
                            ? this.buildLeaf(object[key], elementPath)
                            : this.isArray(object[key])
                            ? this.loopArray(object[key], elementPath)
                            : this.startProObject(object[key], false, elementPath)}
                    </ul>
                </li>
            )
        })

    getNodePathKey = (key: string) => parseInt(key, 10) || key

    getOpenerName = (object, alternativeName = 'opener') => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return object[this.props.nodeKeyForObjectsAndArrays]
        } else {
            return alternativeName
        }
    }

    startProObject = (object, parentIsArray, currentPath: string[]) => {
        return parentIsArray ? (
            <li>
                {' '}
                {this.buildNode(this.getOpenerName(object))}
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
                    : this.startProObject(value, true, elementPath.concat(key))}
            </div>
        ))

    isArray = (value) => Array.isArray(value)

    isPrimitive = (value) => {
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    }

    buildNode = (nodeName: string) => (
        <span
            className="caret node"
            onClick={(e) => {
                this.toggle(e)
            }}>
            {nodeName}
        </span>
    )

    buildLeaf = (value: string, elementPath: string[]) => (
        <EditableLeaf
            elementPath={elementPath}
            onUpdate={(text) => {
                console.log('update value ' + text + ' for ')
                console.log(elementPath)
                this.props.onUpdate(text, elementPath)
            }}
            value={value}
        />
    )

    toggle = (event) => {
        event.target.parentElement.querySelector('.nested').classList.toggle('active')
        event.target.classList.toggle('caret-down')
    }

    render = () => <ul id="myUL">{this.processObject(this.props.data, [])}</ul>
}

export default Tree
