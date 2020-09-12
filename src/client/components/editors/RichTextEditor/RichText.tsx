/* tslint:disable:no-parameter-reassignment*/

import React, {useCallback, useMemo, useState} from 'react' // useMemo
import {Editable, withReact, Slate} from 'slate-react'
import {createEditor, Node} from 'slate'
import './RTEditor.css'
import {isEqual} from 'lodash'
import {RTLeaf} from './RTLeaf'
import {RTElement} from './RTElement'

interface IProps {
    json: Node[]
    style?: {}
}

const RichText = ({json, style}: IProps) => {
    const jsonIn = json
    const [value, setValue] = useState<Node[]>(jsonIn)
    const renderElement = useCallback((props) => <RTElement {...props} />, [])
    const renderLeaf = useCallback((props) => <RTLeaf {...props} />, [])
    let editor = useMemo(() => withReact(createEditor()), [])

    // this is needed to force update for hot reload from manifest
    if (!isEqual(jsonIn, value)) {
        setValue(jsonIn)
    }

    return (
        <div className="rteContainer" style={style}>
            <Slate
                className="rteSlate"
                editor={editor}
                value={value}
                onChange={(value) => {
                    setValue(value)
                }}>
                <Editable
                    style={style}
                    readOnly={true}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some text"
                    autoFocus
                    className="rteEditable"
                />
            </Slate>
        </div>
    )
}

export default RichText
