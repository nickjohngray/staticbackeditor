import React, {Ref, PropsWithChildren} from 'react'
import ReactDOM from 'react-dom'
import {cx, css} from 'emotion'
import {Editor, Transforms} from 'slate'
import {OverridableComponent} from '@material-ui/core/OverridableComponent'
import {SvgIconTypeMap} from '@material-ui/core/SvgIcon/SvgIcon'

export interface IBaseProps {
    className: string
    [key: string]: unknown
}
export type OrNull<T> = T | null

export interface IMakeButton {
    format: string
    Icon: OverridableComponent<SvgIconTypeMap>
}

export const Button = React.forwardRef(
    (
        {
            className,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean
                reversed: boolean
            } & IBaseProps
        >,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
                `
            )}
        />
    )
)

export const EditorValue = React.forwardRef(
    (
        {
            className,
            value,
            ...props
        }: PropsWithChildren<
            {
                value: any
            } & IBaseProps
        >,
        ref: Ref<OrNull<null>>
    ) => {
        const textLines = value.document.nodes
            .map((node) => node.text)
            .toArray()
            .join('\n')
        return (
            <div
                ref={ref}
                {...props}
                className={cx(
                    className,
                    css`
                        margin: 30px -20px 0;
                    `
                )}>
                <div
                    className={css`
                        font-size: 14px;
                        padding: 5px 20px;
                        color: #404040;
                        border-top: 2px solid #eeeeee;
                        background: #f8f8f8;
                    `}>
                    Slate's value as text
                </div>
                <div
                    className={css`
                        color: #404040;
                        font: 12px monospace;
                        white-space: pre-wrap;
                        padding: 10px 20px;
                        div {
                            margin: 0 0 0.5em;
                        }
                    `}>
                    {textLines}
                </div>
            </div>
        )
    }
)
/*
export const Icon = React.forwardRef(
    ({className, ...props}: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
        <AccessAlarmIcon/>
        /!*<span
            {...props}
            ref={ref}
            className={cx(
                'material-icons',
                className,
                css`
                    font-size: 18px;
                    vertical-align: text-bottom;
                `
            )}
        />*!/
    )
)*/

export const Instruction = React.forwardRef(
    ({className, ...props}: PropsWithChildren<IBaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <div
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    white-space: pre-wrap;
                    margin: 0 -20px 10px;
                    padding: 10px 20px;
                    font-size: 14px;
                    background: #f8f8e8;
                `
            )}
        />
    )
)

export const Menu = React.forwardRef(
    ({className, ...props}: PropsWithChildren<IBaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <div
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    & > * {
                        display: inline-block;
                    }
                    & > * + * {
                        margin-left: 15px;
                    }
                `
            )}
        />
    )
)

export const Portal = ({children}) => {
    return ReactDOM.createPortal(children, document.body)
}

export const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

export const LIST_TYPES = ['numbered-list', 'bulleted-list']

export const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format
    })

    return !!match
}

export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

export const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

export const toggleBlock = (editor, format) => {
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
