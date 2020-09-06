/* tslint:disable:no-parameter-reassignment*/

import React, {useCallback, useMemo, useState} from 'react' // useMemo
import {Editable, withReact, Slate} from 'slate-react'
import {createEditor, Node} from 'slate'
import './RTEditor.css'
import {isEqual} from 'lodash'

interface IProps {
    json: Node[]
}

const RichText = ({json}: IProps) => {
    const jsonIn = json
    const [value, setValue] = useState<Node[]>(jsonIn)
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    let editor = useMemo(() => withReact(createEditor()), [])

    // this is needed to force update for hot reload from manifest
    if (!isEqual(jsonIn, value)) {
        setValue(jsonIn)
    }

    return (
        <div className="rteContainer">
            <Slate
                className="rteSlate"
                editor={editor}
                value={value}
                onChange={(value) => {
                    setValue(value)
                }}>
                <Editable
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

const Element = ({attributes, children, element}) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        // @ts-ignore
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        // @ts-ignore
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        // @ts-ignore
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        // @ts-ignore
        children = <u>{children}</u>
    }
    // @ts-ignore
    return <span {...attributes}>{children}</span>
}

export default RichText
