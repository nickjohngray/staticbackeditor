/* tslint:disable:no-parameter-reassignment*/
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle, faInstagram} from '@fortawesome/free-brands-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {Simulate} from 'react-dom/test-utils'
import error = Simulate.error
import PdfViewer from '../../generic/PdfViewer'

const faIcons = {
    faFacebook,
    faGoogle,
    faInstagram,
    faPhone
}

export const RTLeaf = ({attributes, children, leaf}) => {
    // return <FontAwesomeIcon size="1x" icon={faGoogle} />
    if (leaf.type === 'linkWithIcon') {
        if (!faIcons[leaf.icon]) {
            throw new Error('tried to make fa icon but ' + leaf.icon + ' is not supported')
        }

        children = (
            <a className="w-a" href={leaf.href} placeholder={leaf.placeholder}>
                <FontAwesomeIcon size={leaf.size} icon={faIcons[leaf.icon]} />
                <span>{leaf.text}</span>
            </a>
        )
    }
    /*if (leaf.type === 'pdf') {
        const lastSlash = leaf.file.lastIndexOf('/')
        if (lastSlash === -1) {
            throw "can't build pdf viewer , could not find last slash in" + leaf.file
        }
        const fixedPath = '/pdf' + leaf.file.substring(lastSlash)
        children = <PdfViewer file={fixedPath}> </PdfViewer>
    }*/
    if (leaf.br) {
        children = <br />
    }

    if (leaf.span) {
        children = <span>{children}</span>
    }

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
