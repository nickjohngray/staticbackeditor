import {SortableElement} from 'react-sortable-hoc'
import * as React from 'react'

export const DragItem = SortableElement(({value}) => {
    return <li className="drag_item">{value}</li>
})
