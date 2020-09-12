import React, {useRef} from 'react'
import DragIndicator from '@material-ui/icons/DragIndicator'

export const DragHandle = () => {
    const ul = useRef(null)
    return <DragIndicator ref={ul} className="drag_handle" />
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
