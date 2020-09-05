/* tslint:disable:no-parameter-reassignment*/

import {Button, Toolbar} from './RichTextEditorComponents'
import React, {useCallback, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, withReact, useSlate, Slate} from 'slate-react'
import {Editor, Transforms, createEditor, Node, Text} from 'slate'
import escapeHtml from 'escape-html'
import {withHistory} from 'slate-history'
import {jsx} from 'slate-hyperscript'
import FormatBold from '@material-ui/icons/FormatBold'
import FormatUnderlined from '@material-ui/icons/FormatUnderlined'
import Code from '@material-ui/icons/Code'
import LooksOne from '@material-ui/icons/LooksOne'
import LooksTwo from '@material-ui/icons/LooksTwo'
import FormatQuote from '@material-ui/icons/FormatQuote'
import FormatListNumbered from '@material-ui/icons/FormatListNumbered'
import FormatListBulleted from '@material-ui/icons/FormatListBulleted'
import {OverridableComponent} from '@material-ui/core/OverridableComponent'
import {SvgIconTypeMap} from '@material-ui/core/SvgIcon/SvgIcon'
import {FormatItalic} from '@material-ui/icons'
import './RichTextEditor.css'

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

interface IProps {
    html: Node[]
    onBlur?: () => void
    onChange?: (html: string) => void
    isReadOnly?: boolean
}

const RichTextEditor = ({html, onBlur, onChange, isReadOnly = false}: IProps) => {
    const [value, setValue] = useState<Node[]>(html)
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    return (
        <div className="rteContainer">
            <Slate
                className="rteSlate"
                editor={editor}
                value={value}
                onChange={(value) => {
                    setValue(value)
                    if (!isReadOnly && onChange) {
                        onChange(JSON.stringify(value))
                    }
                }}>
                {/* {!props.isReadOnly && ( */}

                {!isReadOnly && (
                    <Toolbar className="rteToolbar">
                        <MarkButton format="bold" Icon={FormatBold} />
                        <MarkButton format="italic" Icon={FormatItalic} />
                        <MarkButton format="underline" Icon={FormatUnderlined} />
                        <MarkButton format="code" Icon={Code} />
                        <BlockButton format="heading-one" Icon={LooksOne} />
                        <BlockButton format="heading-two" Icon={LooksTwo} />
                        <BlockButton format="block-quote" Icon={FormatQuote} />
                        <BlockButton format="numbered-list" Icon={FormatListNumbered} />
                        <BlockButton format="bulleted-list" Icon={FormatListBulleted} />
                    </Toolbar>
                )}

                <Editable
                    readOnly={isReadOnly}
                    onBlur={onBlur}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some text"
                    spellCheck
                    autoFocus
                    className="rteEditable"
                    onKeyDown={(event) => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event as any)) {
                                event.preventDefault()
                                const mark = HOTKEYS[hotkey]
                                toggleMark(editor, mark)
                            }
                        }
                    }}
                />
            </Slate>
        </div>
    )
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) => LIST_TYPES.includes(n.type as string),
        split: true
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format
    })

    if (!isActive && isList) {
        const block = {type: format, children: []}
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format
    })

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
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

interface IMakeButton {
    format: string
    Icon: OverridableComponent<SvgIconTypeMap>
}

const BlockButton = ({format, Icon}: IMakeButton) => {
    const editor = useSlate()
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}>
            <Icon />
        </Button>
    )
}

const MarkButton = ({format, Icon}: IMakeButton) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}>
            <Icon />
        </Button>
    )
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            {text: 'This is editable '},
            {text: 'rich', bold: true},
            {text: ' text, '},
            {text: 'much', italic: true},
            {text: ' better than a '},
            {text: '<textarea>', code: true},
            {text: '!'}
        ]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: "Since it's rich text, you can do things like turn a selection of text "
            },
            {text: 'bold', bold: true},
            {
                text: ', or add a semantically rendered block quote in the middle of the page, like this:'
            }
        ]
    },
    {
        type: 'block-quote',
        children: [{text: 'A wise quote.'}]
    },
    {
        type: 'paragraph',
        children: [{text: 'Try it out for yourself!'}]
    }
]

// convert html to json
export const deserialize = (el) => {
    if (el.nodeType === 3) {
        return el.textContent
    } else if (el.nodeType !== 1) {
        return null
    } else if (el.nodeName === 'BR') {
        return '\n'
    }

    const {nodeName} = el
    let parent = el

    if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
        parent = el.childNodes[0]
    }
    // @ts-ignore
    const children = Array.from(parent.childNodes).map(deserialize).flat()

    if (el.nodeName === 'BODY') {
        return jsx('fragment', {}, children)
    }

    if (ELEMENT_TAGS[nodeName]) {
        const attrs = ELEMENT_TAGS[nodeName](el)
        return jsx('element', attrs, children)
    }

    if (TEXT_TAGS[nodeName]) {
        const attrs = TEXT_TAGS[nodeName](el)
        return children.map((child) => jsx('text', attrs, child))
    }

    return children
}

// convert json to html
const serialize = (node) => {
    if (Array.isArray(node)) {
        if (Text.isText(node[0])) {
            return escapeHtml(node[0].text)
        }
    }
    if (Text.isText(node)) {
        return escapeHtml(node.text)
    }

    const children = node.children.map((n) => serialize(n)).join('')

    switch (node.type) {
        case 'quote':
            return `<blockquote><p>${children}</p></blockquote>`
        case 'paragraph':
            return `<p>${children}</p>`
        case 'link':
            return `<a href="${escapeHtml(node.url)}">${children}</a>`
        default:
            return children
    }
}

const ELEMENT_TAGS = {
    A: (el) => ({type: 'link', url: el.getAttribute('href')}),
    BLOCKQUOTE: () => ({type: 'quote'}),
    H1: () => ({type: 'heading-one'}),
    H2: () => ({type: 'heading-two'}),
    H3: () => ({type: 'heading-three'}),
    H4: () => ({type: 'heading-four'}),
    H5: () => ({type: 'heading-five'}),
    H6: () => ({type: 'heading-six'}),
    IMG: (el) => ({type: 'image', url: el.getAttribute('src')}),
    LI: () => ({type: 'list-item'}),
    OL: () => ({type: 'numbered-list'}),
    P: () => ({type: 'paragraph'}),
    PRE: () => ({type: 'code'}),
    UL: () => ({type: 'bulleted-list'})
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
    CODE: () => ({code: true}),
    DEL: () => ({strikethrough: true}),
    EM: () => ({italic: true}),
    I: () => ({italic: true}),
    S: () => ({strikethrough: true}),
    STRONG: () => ({bold: true}),
    U: () => ({underline: true})
}

export default RichTextEditor
