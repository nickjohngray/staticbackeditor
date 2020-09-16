import React, {Ref, PropsWithChildren} from 'react'
import ReactDOM from 'react-dom'
import {cx, css} from 'emotion'
import {Editor, Transforms} from 'slate'

export interface IBaseProps {
    className: string

    [key: string]: unknown
}

export type OrNull<T> = T | null

export interface IRTButton {
    format: string
    Icon: any
}

type IButton = PropsWithChildren<
    {
        active: boolean
        reversed: boolean
    } & IBaseProps
>
/*
export const Button = React.forwardRef(({className, active, reversed, ...props}: IButton, ref: Ref<OrNull<any>>) => (
    <div
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
))*/

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

export const aboutPageValue = [
    {
        type: 'div',
        className: 'w-page w-center-it',
        children: [
            {
                type: 'div',
                children: [
                    {type: 'h1', className: 'center-text w-h1', children: [{text: 'About us'}]},
                    {text: ' We are a Strongman Gym and cater to both female and male athletes'},
                    {text: '', br: true},
                    {
                        text:
                            'We offer classes in the evening from 7.30pm to 9.30pm Monday to Friday, coached by Owner and Director of Strength Pit.'
                    },
                    {text: '', br: true},
                    {text: 'Online coaching and online programming.'},
                    {
                        type: 'p',
                        children: [
                            {type: 'h1', className: 'w-h1', children: [{text: 'History'}]},
                            {
                                text:
                                    'Strength Pit Otara was born out of the passion to facilitate a safe place, tailored for Maori and Pasifika to be themselves, and grow their natural strength.'
                            },
                            {text: '', br: true},
                            {
                                text:
                                    'Coach Afaese Paea, born and bred in Otara, always had a interest in strength sports, powerlifting, martial arts and Rugby.'
                            },
                            {text: '', br: true},
                            {
                                text:
                                    'While browsing around the big boys toys one year he stumbled across a Strongman event at the Easter Show back in 2005 - 2006 and searched how to get involved in that sport.'
                            },
                            {
                                type: 'p',
                                children: [
                                    {
                                        text:
                                            'And the rest is history, his first Novice competition he won without any training and then decided to pursue the NZ Strongman Arena.'
                                    },
                                    {text: '', br: true},
                                    {
                                        text:
                                            'Due to the events being few and far between it was difficult to train without the apparatus’s so we decided to offer strength training to a local Box Empire Training Box based in Otara back in 2014 and the word got around and some 10 poly boys started showing up after the Box had closed.'
                                    },
                                    {text: '', br: true},
                                    {
                                        text:
                                            'Thanks to a really good mate also born and bred in Otara Lama Saga loaned us his space until we out grew it.'
                                    },
                                    {
                                        type: 'p',
                                        children: [
                                            {
                                                text:
                                                    'We set up officially in June 2015, and operate online coaching, strength and conditioning workshops all over the country and have Athletes competing in Strongman both in NZ and Australia.'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {type: 'h2', className: 'w-center-text w-h2 white-text', children: [{text: 'Contact Us'}]},
            {
                type: 'div',
                className: 'w-center-text w-social-icons',
                children: [
                    {
                        type: 'linkWithIcon',
                        href: 'mailto:strengthpitotara@gmail.com',
                        icon: 'faGoogle',
                        size: 'x1',
                        text: 'StrengthPitOtara@gmail.com',
                        target: '_new'
                    },
                    {text: '', br: true},
                    {
                        type: 'linkWithIcon',
                        href: 'https://www.facebook.com/StrengthPitOtaraLimited',
                        icon: 'faFacebook',
                        size: 'x1',
                        text: 'StrengthPitOtaraLimited',
                        placeholder: 'Facebook Strength Pit Otara Limited',
                        target: '_new'
                    },
                    {text: '', br: true},
                    {
                        type: 'linkWithIcon',
                        href: 'https://www.instagram.com/nzstrengthcoach/',
                        icon: 'faInstagram',
                        size: 'x1',
                        text: 'NZStrengthCoach',
                        target: '_new'
                    },
                    {text: '', br: true},
                    {
                        type: 'linkWithIcon',
                        href: 'tel:0220122821',
                        icon: 'faPhone',
                        size: 'x1',
                        text: '(022) 012 2821',
                        target: '_new'
                    }
                ]
            },
            {text: '', br: true},
            {
                type: 'h2',
                className: 'w-center-text  w-h2 white-text',
                children: [{text: 'Athletes coached by NZ strength coach'}]
            },
            {
                type: 'h2 w-h2',
                className: 'w-center-text w-h2',
                children: [
                    {
                        className: 'w-a',
                        type: 'a',
                        title: 'download',
                        href: './../src/pdf/strength_pit_otara_strongman_athletes_board_2020.pdf',
                        children: [{text: 'Strong Man Athletes Board 2020'}]
                    }
                ]
            },
            {
                type: 'pdf',
                file: './../src/pdf/strength_pit_otara_strongwoman_athletes_board_2020.pdf',
                children: [{text: ''}]
            },
            {
                type: 'h2 w-h2',
                className: 'w-center-text w-h2',
                children: [
                    {
                        className: 'w-a',
                        type: 'a',
                        title: 'download',
                        href: './../src/pdf/strength_pit_otara_strongwoman_athletes_board_2020.pdf',
                        children: [{text: 'Strong Woman Athletes Board 2020'}]
                    }
                ]
            },
            {
                type: 'pdf',
                file: './../src/pdf/strength_pit_otara_strongwoman_athletes_board_2020.pdf',
                children: [{text: ''}]
            }
        ]
    }
]

const initialValue2 = [
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
