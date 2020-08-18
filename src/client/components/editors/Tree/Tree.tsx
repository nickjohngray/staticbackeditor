import * as React from 'react'
import './Tree.css'
import EditableLeaf from './EditableLeaf/EditableLeaf'
import {cloneDeep} from 'lodash'

export interface IProps {
    data: object[]
    nodeKeyForObjectsAndArrays: string
    skipKey: string
    onUpdate: (data: {}) => void
}

interface IState {
    isDirty: boolean
    data: object[]
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
        // clone the the data as when leaf data changes it can easy update by reference
        // at the same time not mutating the original data
        this.state = {isDirty: false, data: cloneDeep(this.props.data)}
    }

    processObject = (object) =>
        Object.keys(object).map((key, reactKey) => {
            if (key === this.props.skipKey) {
                return <> </>
            }
            return (
                <li key={reactKey + key}>
                    {this.buildNode(this.getOpenerName(object[key], key))}
                    {/*if  "nested active" here it will it expanded*/}
                    <ul className="nested">
                        {this.isPrimitive(object[key])
                            ? this.buildLeaf(object, key)
                            : this.isArray(object[key])
                            ? this.loopArray(object[key])
                            : this.startProObject(object[key], false)}
                    </ul>
                </li>
            )
        })

    getOpenerName = (object, alternativeName = 'opener') => {
        if (object[this.props.nodeKeyForObjectsAndArrays]) {
            return object[this.props.nodeKeyForObjectsAndArrays]
        } else {
            return alternativeName
        }
    }

    startProObject = (object, parentIsArray) => {
        return parentIsArray ? (
            <li>
                {' '}
                {this.buildNode(this.getOpenerName(object))}
                {/*if  "nested active" here it will be expanded on make*/}
                <ul className="nested">{this.processObject(object)}</ul>
            </li>
        ) : (
            this.processObject(object)
        )
    }

    loopArray = (array) =>
        array.map((value, key) => (
            <div key={key + value}>
                {this.isPrimitive(value)
                    ? this.buildLeafOld(value)
                    : this.isArray(value)
                    ? this.loopArray(value)
                    : this.startProObject(value, true)}
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
    buildLeafOld = (value: string) => <EditableLeaf onUpdate={(text) => alert(text)} value={value} />

    buildLeaf = (object: {}, key: string) => (
        <EditableLeaf
            onUpdate={(text) => {
                /* object is part of this state
                This is only possible as state is cloned
                this provides a very easy way to get this leaf data updated*/
                object[key] = text
                this.props.onUpdate(this.state.data)
            }}
            value={object[key]}
        />
    )

    toggle = (event) => {
        event.target.parentElement.querySelector('.nested').classList.toggle('active')
        event.target.classList.toggle('caret-down')
    }

    render = () => (
        <>
            <ul id="myUL">{this.processObject(this.state.data)}</ul>
        </>
    )
}

export default Tree
