import React, {useState, useMemo} from 'react'
import {createEditor, Node} from 'slate'
import {Slate, Editable, withReact} from 'slate-react'

interface IProps {
    html: Node[]
}

const RichTextReadOnly = (props: IProps) => {
    const [value, setValue] = useState<Node[]>(props.html)
    const editor = useMemo(() => withReact(createEditor()), [])
    return (
        <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
            <Editable readOnly placeholder="Enter some plain text..." />
        </Slate>
    )
}

export default RichTextReadOnly
