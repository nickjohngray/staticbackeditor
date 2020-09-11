/* tslint:disable:no-parameter-reassignment*/
import {faFacebook, faGoogle, faInstagram} from '@fortawesome/free-brands-svg-icons'
import {RTImageElement} from './RTImageElement'
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import PdfViewer from '../../generic/PdfViewer'
import {Document, Page} from 'react-pdf'
import {Transforms, createEditor, Node} from 'slate'
import {useEditor, ReactEditor, useSelected, useFocused} from 'slate-react'
import {css} from 'emotion'

const pdfIconSrc = require('./../../../assets/images/pdf_icon.png')

export const RTElement = (props) => {
    const {attributes, children, element} = props
    /*return <QuoteElement {...props} />*/

    // return <FontAwesomeIcon size="1x" icon={faGoogle} />

    switch (element.type) {
        default:
            return <p {...attributes}>{children}</p>
        case 'pdf':
            const lastSlash = element.file.lastIndexOf('/')
            if (lastSlash === -1) {
                throw new Error("can't build pdf viewer , could not find last slash in" + element.file)
            }
            const fixedPath = '/easyecom' + element.file.substring(lastSlash)
            /* return (
                <>
                    <img style={{width: '100px', objectFit: 'contain'}} src={pdfIconSrc} alt={'pdf-' + fixedPath} />
                    <span>{element.file}</span>
                </>
            )*/

            const selected = useSelected()
            const focused = useFocused()
            return (
                <div {...attributes}>
                    <div contentEditable={false}>
                        <img
                            {...attributes}
                            className={css`
                                display: block;
                                margin: AUTO;
                                width: 50%;
                                box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                            `}
                            style={{width: '100px', objectFit: 'contain'}}
                            src={pdfIconSrc}
                        />
                    </div>
                    {children}
                    {/* <PdfViewer file={fixedPath} />*/}
                </div>
            )

        /* return (
                <PdfViewer isDisabled file={fixedPath} {...attributes}>
                    {children}
                </PdfViewer>
            )*/

        /* const lastSlash = element.file.lastIndexOf('/')
            if (lastSlash === -1) {
                throw new Error("can't build pdf viewer , could not find last slash in" + element.file)
            }
            const fixedPath = '/pdf' + element.file.substring(lastSlash)
            return <PdfElement {...{attributes, children, element: {...element, url: fixedPath}}} />*/
        /*return (
                <Document file={fixedPath} onLoadSuccess={this.onDocumentLoadSuccess}>
                    <Page pageNumber={1} />
                </Document>
            )*/

        /*  PdfViewer file={fixedPath}> </PdfViewer>*/
        case 'div':
            return (
                <div className={element.className} {...attributes}>
                    {children}
                </div>
            )
        case 'h1':
            return (
                <h1 className={element.className} {...attributes}>
                    {children}
                </h1>
            )
        case 'h2':
            return (
                <h2 className={element.className} {...attributes}>
                    {children}
                </h2>
            )

        case 'a':
            return (
                <a className={element.className} href={element.href} {...attributes}>
                    {children}
                </a>
            )

        case 'quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'code':
            return (
                <pre>
                    <code {...attributes}>{children}</code>
                </pre>
            )
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        case 'link':
            return (
                <a href={element.url} {...attributes}>
                    {children}
                </a>
            )
        case 'image':
            return <RTImageElement {...props} />
    }
}

const PdfElement = ({attributes, children, element}) => {
    const editor = useEditor()
    const {url} = element
    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <div
                    style={{
                        padding: '75% 0 0 0',
                        position: 'relative'
                    }}>
                    <iframe
                        src={`${url}?title=0&byline=0&portrait=0`}
                        frameBorder="0"
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </div>
            </div>
            {children}
        </div>
    )
}
