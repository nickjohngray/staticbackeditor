import {aboutPageValue, HOTKEYS, toggleMark} from './RTEditorUtil'
import React, {useCallback, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, withReact, Slate} from 'slate-react'
import {createEditor, Node} from 'slate'

import {withHistory} from 'slate-history'
import './RTEditor.css'
import {RTToolbar} from './RTToolbar/RTToolbar'
import {withHtml} from './withHtml'
import {RTElement} from './RTElement'
import {RTLeaf} from './RTLeaf'
import './website.css'

interface IProps {
    html: Node[]
    onBlur?: () => void
    onChange?: (html: string) => void
    isReadOnly?: boolean
}

const RTEditor = ({html, onBlur, onChange, isReadOnly = false}: IProps) => {
    const [value, setValue] = useState<Node[]>(html)
    const renderElement = useCallback((props) => <RTElement {...props} />, [])
    const renderLeaf = useCallback((props) => <RTLeaf {...props} />, [])
    const editor = useMemo(() => withHtml(withHistory(withReact(createEditor()))), [])

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

export default RTEditor
