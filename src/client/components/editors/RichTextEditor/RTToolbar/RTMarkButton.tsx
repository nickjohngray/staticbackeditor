import {useSlate} from 'slate-react'
import {Button, IMakeButton, isMarkActive, toggleMark} from '../RTEditorUtil'
import React from 'react'

export const RTMarkButton = ({format, Icon}: IMakeButton) => {
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
