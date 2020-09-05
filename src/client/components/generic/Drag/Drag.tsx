import {SortableContainer} from 'react-sortable-hoc'
import MainContext from '../../../context/MainContext'
import React, {useContext} from 'react'
import {DragItem} from './DragItem'
import './Drag.css'

export const DragX = SortableContainer((props) => {
    const mainContext = useContext(MainContext)

    return (
        <ul ref={props.inputRef} className="tree_group drag_list">
            {props.items.map((value, index) => {
                return <DragItem key={'item-' + index + '-' + value} index={index} value={value} />
            })}
        </ul>
    )
})

export const Drag = React.forwardRef((props, ref) => {
    return <DragX {...props} inputRef={ref} />
})
