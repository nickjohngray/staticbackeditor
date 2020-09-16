import {useSlate} from 'slate-react'
import {IRTButton, isBlockActive, toggleBlock} from '../RTEditorUtil'
import React from 'react'
import {css, cx} from 'emotion'

export const RTBlockButton = ({format, Icon}: IRTButton) => {
    const editor = useSlate()
    const isActive: boolean = isBlockActive(editor, format)
    return (
        <span
            onMouseDown={(event) => {
                event.preventDefault()
                toggleBlock(editor, format)
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
