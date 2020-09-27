import {Editor} from 'slate'
import {useSlate} from 'slate-react'
import {IRTButton, isMarkActive, toggleMark} from '../RTEditorUtil'
import React from 'react'
import {css, cx} from 'emotion'

export const RTMarkButton = ({format, Icon, disableButtons = {}, value}: IRTButton) => {
    const editor = useSlate()
    const isActive = isMarkActive(editor, format, value)

    return (
        <span
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format, value)

               /* const disableButtonKeys = Object.keys( disableButtons)

                disableButtonKeys.forEach((key) => {
                    if(key === format) return
                    Editor.addMark(editor, key, false)
                })
*/

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
