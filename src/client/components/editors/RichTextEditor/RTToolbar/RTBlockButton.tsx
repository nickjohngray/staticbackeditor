import {useSlate} from 'slate-react'
import {Button, IMakeButton, isBlockActive, toggleBlock} from '../RTEditorUtil'
import React from 'react'

export const RTBlockButton = ({format, Icon}: IMakeButton) => {
    const editor = useSlate()
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}>
            <Icon />
        </Button>
    )
}
