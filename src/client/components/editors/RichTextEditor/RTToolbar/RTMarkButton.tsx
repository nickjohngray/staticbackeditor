import {Editor} from 'slate'
import {useSlate} from 'slate-react'
import {IRTButton, isMarkActive, toggleMark} from '../RTEditorUtil'
import React from 'react'
import {css, cx} from 'emotion'
import { SketchPicker } from 'react-color'
import {ColorPicker} from './ColorPicker/ColorPicker'

export const RTMarkButton = ({format, Icon, value, onClick}: IRTButton) => {
    const editor = useSlate()
    const isActive = isMarkActive(editor, format, value)

    return (
        <span
            onMouseDown={(event) => {
                event.preventDefault()
                /*if( format === 'color' ) {
                    return <ColorPicker />
                }*/
                if(!onClick) {
                    toggleMark(editor, format, value)
                } else {
                    onClick()
                }

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
