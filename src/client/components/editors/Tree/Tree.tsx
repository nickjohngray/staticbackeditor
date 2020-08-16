import * as React from 'react'
import './Tree.css'
import EditableLeaf from './EditableLeaf'

export interface IProps {
    data?: {}
}

interface IState {
    isDirty: boolean
}

const testJson = {
    Beverages: [
        'Water',
        'Coffee',
        {
            Tea: [
                true,
                34534,
                'Green Tea',
                {
                    Sencha: ['Gyokuro', 'Matcha', 'Pi Lo Chun']
                }
            ]
        }
    ]
}

/*
       json object in
       1. loop object keys.
       2. build node from key name.
       3. get value from key:
       4. if value is primative build leaf
       5. if value is object repeat step 1
       6. if value is array loop array
           6.1 if value is primative build leaf
           6.2 if value is object repeat 1
           6.3 if value is array repeat 6
 */

class Tree extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)
    }

    processObject = (object) =>
        Object.keys(object).map((key, reactKey) => {
            return (
                <li key={reactKey + key}>
                    {this.buildNode(key)}
                    <ul className='nested active'>
                        {this.isPrimitive(object[key])
                            ? this.buildLeaf(object[key])
                            : this.isArray(object[key])
                            ? this.loopArray(object[key])
                            : this.startProObject(object[key], false)}
                    </ul>
                </li>
            )
        })

    startProObject = (object, parentIsArray) => {
        return parentIsArray ? (
            <li>
                {' '}
                {this.buildNode('opener')}
                <ul className='nested active'>{this.processObject(object)}</ul>
            </li>
        ) : (
            this.processObject(object)
        )
    }

    loopArray = (array) =>
        array.map((value, key) => (
            <div key={key + value}>
                {this.isPrimitive(value)
                    ? this.buildLeaf(value)
                    : this.isArray(value)
                    ? this.loopArray(value)
                    : this.startProObject(value, true)}
            </div>
        ))

    isArray = (value) => Array.isArray(value)

    isPrimitive = (value) => {
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    }

    buildNode = (key: string) => (
        <span
            className='node'
            onClick={(e) => {
                this.toggle(e)
            }}>
            {key}
        </span>
    )

    buildLeaf = (value: string) => <EditableLeaf isEditMode={true} value={value} />
    /*<li className="leaf"
            onClick={
                (e) => {

                }}>
            {value}
        </li>*/

    toggle = (event) => {
        event.target.parentElement.querySelector('.nested').classList.toggle('active')
        event.target.classList.toggle('node-down')
    }

    render = () => (
        <>
            <ul id='myUL'>{this.processObject(testJson)}</ul>
        </>
    )
}

export default Tree
