import {aboutPageValue, HOTKEYS, toggleMark} from './RTEditorUtil'
import React, {useCallback, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, withReact, Slate} from 'slate-react'
import {createEditor, Node as INode, Transforms} from 'slate'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import {useMemoOne, useCallbackOne} from 'use-memo-one'

import {withHistory} from 'slate-history'
import './RTEditor.css'
import {RTToolbar} from './RTToolbar/RTToolbar'
import {withHtml} from './withHtml'
import {RTElement} from './RTElement'
import {RTLeaf} from './RTLeaf'
import './website.css'

interface IProps {
    data: INode[]
    onBlur?: (data: INode[]) => void
    onChange?: (data: INode[]) => void
    isReadOnly?: boolean
    style?: {}
}

const x = [
    {
        type: 'div',
        children: [
            {
                type: 'h1',
                className: 'center-text w-h1',
                children: [
                    {
                        text: 'About us'
                    }
                ]
            },
            {
                text: 'We are a Strongman Gym and cater to both female and male athletes'
            },
            {
                text: '',
                br: true
            },
            {
                text:
                    'We offer classes in the evening from 7.30pm to 9.30pm Monday to Friday, coached by Owner and Director of Strength Pit.'
            },
            {
                text: '',
                br: true
            },
            {
                text: 'Online coaching and online programming.'
            },
            {
                type: 'p',
                children: [
                    {
                        type: 'h1',
                        className: 'w-h1',
                        children: [
                            {
                                text: 'History'
                            }
                        ]
                    },
                    {
                        text:
                            'Strength Pit Otara was born out of the passion to facilitate a safe place, tailored for Maori and Pasifika to be themselves, and grow their natural strength.'
                    },
                    {
                        text: '',
                        br: true
                    },
                    {
                        text:
                            'Coach Afaese Paea, born and bred in Otara, always had a interest in strength sports, powerlifting, martial arts and Rugby.'
                    },
                    {
                        text: '',
                        br: true
                    },
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
                            {
                                text: '',
                                br: true
                            },
                            {
                                text:
                                    'Due to the events being few and far between it was difficult to train without the apparatus’s so we decided to offer strength training to a local Box Empire Training Box based in Otara back in 2014 and the word got around and some 10 poly boys started showing up after the Box had closed.'
                            },
                            {
                                text: '',
                                br: true
                            },
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
    }
]

const RTEditor = ({data, onBlur, onChange, isReadOnly = false, style}: IProps) => {
    const [value, setValue] = useState<INode[]>(data)
    const renderElement = useCallback((props) => <RTElement {...props} />, [])
    const renderLeaf = useCallbackOne((props) => <RTLeaf {...props} />, [])
    const editor = useMemoOne(() => withHistory(withReact(createEditor())), [])

    return (
        <div className="rteContainer" style={style}>
            <Slate
                className="rteSlate"
                editor={editor}
                value={value}
                onChange={(value) => {
                    setValue(value)
                    if (!isReadOnly && onChange) {
                        onChange(value)
                    }
                }}>
                {!isReadOnly && <RTToolbar className="rteToolbar" />}

                <Editable
                    readOnly={isReadOnly}
                    onBlur={() => onBlur(value)}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some text"
                    spellCheck
                    autoFocus
                    className="rteEditable"
                    style={style}
                    onMouseDown={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                        /*if ((event.target as HTMLElement).className.indexOf('react-pdf') !== -1) {
                            event.preventDefault()
                        }*/
                    }}
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

const withImages = (editor) => {
    const {insertData, isVoid} = editor

    editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = (data) => {
        const text = data.getData('text/plain')
        const {files} = data

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result
                        insertImage(editor, url)
                    })

                    reader.readAsDataURL(file)
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

const isImageUrl = (url) => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

export const insertImage = (editor, url) => {
    const text = {text: ''}
    const image = {type: 'image', url, children: [text]}
    Transforms.insertNodes(editor, image)
}

export default RTEditor
