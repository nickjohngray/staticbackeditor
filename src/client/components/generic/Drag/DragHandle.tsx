import React, {useRef} from 'react'
import {DragHandleIcon} from '../icons'

export const DragHandle = () => {
    const ul = useRef(null)
    return <DragHandleIcon ref={ul} className="drag_handle" />
}

export const isDragHandle = (target: HTMLElement) => {
    const className = target.className
    if (typeof className === 'object' || typeof target.parentElement.className === 'object') {
        if (
            // @ts-ignore we need this check  as delete button maybe the target
            className.baseVal.indexOf('drag_handle') !== -1 ||
            // @ts-ignore
            target.parentElement.className.baseVal.indexOf('drag_handle') !== -1
        ) {
            return true
        }
    }
    return false
}
