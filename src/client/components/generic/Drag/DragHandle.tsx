import React, {useRef} from 'react'

export const DragHandle = () => {
    const ul = useRef(null)
    return (
        <div ref={ul} title="Click to drag page to new location" className="drag_handle">
            |||{' '}
        </div>
    )
}
