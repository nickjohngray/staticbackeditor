import {useSlate} from 'slate-react'
import {IRTButton, isMarkActive, toggleMark} from '../RTEditorUtil'
import React from 'react'
import {css, cx} from 'emotion'

export const RTMarkButton = ({format, Icon}: IRTButton) => {
    const editor = useSlate()
    const isActive = isMarkActive(editor, format)
    return (
        <span
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}>
            <Icon
                className={cx(
                    css`
                        cursor: pointer;
                        fill: ${isActive ? '#fff' : '#aaa'};
                    `
                )}
            />
        </span>
    )
}
