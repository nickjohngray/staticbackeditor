/* tslint:disable:no-parameter-reassignment*/
import React from 'react'

export const RTLeaf = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    if (leaf.strikethrough) {
        children = <del>{children}</del>
    }

    return <span {...attributes}>{children}</span>
}
