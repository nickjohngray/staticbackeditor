import {aboutPageValue, HOTKEYS, toggleMark} from './RTEditorUtil'
import React, {useCallback, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, withReact, Slate} from 'slate-react'
import {createEditor, Node as INode, Transforms} from 'slate'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'

import {withHistory} from 'slate-history'
import './RTEditor.css'
import {RTToolbar} from './RTToolbar/RTToolbar'
import {withHtml} from './withHtml'
import {RTElement} from './RTElement'
import {RTLeaf} from './RTLeaf'
import './website.css'

interface IProps {
    data: INode[]
    onBlur?: () => void
    onChange?: (data: INode[]) => void
    isReadOnly?: boolean
}

const RTEditor = ({data, onBlur, onChange, isReadOnly = false}: IProps) => {
    const [value, setValue] = useState<INode[]>(data)
    const renderElement = useCallback((props) => <RTElement {...props} />, [])
    const renderLeaf = useCallback((props) => <RTLeaf {...props} />, [])
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), [])

    return (
        <div className="rteContainer">
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
                    onBlur={onBlur}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some text"
                    spellCheck
                    autoFocus
                    className="rteEditable"
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
