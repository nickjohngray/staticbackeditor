/* tslint:disable:no-parameter-reassignment*/
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle, faInstagram} from '@fortawesome/free-brands-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {Simulate} from 'react-dom/test-utils'
import {useFocused, useSelected} from 'slate-react'

// const pdfIconSrc = require('./../../../assets/images/pdf_icon.svg')
// import pdfIconSrc  from  './../../../assets/images/pdf_icon.svg'

const faIcons = {
    faFacebook,
    faGoogle,
    faInstagram,
    faPhone
}

export const RTLeaf = ({attributes, children, leaf}) => {
    // return <FontAwesomeIcon size="1x" icon={faGoogle} />
    const selected = useSelected()
    const focused = useFocused()
    if (leaf.color ) {
        children = <span style={{color:leaf.color}}>{children}</span>
    }
    if (leaf.align ) {
        children = <div style={{width:'100%', textAlign:leaf.align}}>{children}</div>
    }

   /* if (leaf.alignLeft || leaf.alignRight || leaf.alignCenter || leaf.alignJustify ) {
        let align: any  = 'left'
        if(leaf.alignRight) {
            align = 'right'
        } else if( leaf.alignCenter) {
            align = 'center'
        } else if( leaf.alignJustify){
            align = 'justify'
        }
        children = <div style={{width:'100%', textAlign:align}}>{children}</div>
    }*/

    /*if (leaf.alignRight) {
        children = <div style={{width:'100%',textAlign:'right'}}>{children}</div>
    }
    if (leaf.alignCenter) {
        children = <div style={{width:'100%',textAlign:'center'}}>{children}</div>
    }
    if (leaf.alignJustify) {
        children = <div style={{width:'100%',textAlign:'justify'}}>{children}</div>
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
