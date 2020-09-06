import {useFocused, useSelected} from 'slate-react'
import {css} from 'emotion'
import React from 'react'

export const RTImageElement = ({attributes, children, element}) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            {children}
            <img
                src={element.url}
                className={css`
                    display: block;
                    max-width: 100%;
                    max-height: 20em;
                    box-shadow: ${selected && focused ? '0 0 0 2px blue;' : 'none'};
                `}
            />
        </div>
    )
}
