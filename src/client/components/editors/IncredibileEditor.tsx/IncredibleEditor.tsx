import React, {useContext} from 'react'
import {getClassName, IIncredibleItem, types} from './index'
import './IncredibleEditor.css'
import RichText from '../RichTextEditor/RichText'
import RTEditor from '../RichTextEditor/RTEditor'
import {IMoveNodeOrLeafToMethod, IObjectPath, IProduct, ISection} from '../../../../shared/typings'
import {Node as INode} from 'slate'
import MainContext from '../../../context/MainContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle, faInstagram} from '@fortawesome/free-brands-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import PdfViewer from '../../generic/PdfViewer'

const pdfIconSrc = require('./../../../assets/images/pdf_icon.png')

const faIcons = {
    faFacebook,
    faGoogle,
    faInstagram,
    faPhone
}

interface IPros {
    data: IIncredibleItem
    onUpdate: (text: string, objectPath: IObjectPath) => void
    onAdd: (jsonObject: object, objectPath: IObjectPath) => void
    onDelete: (objectPath: IObjectPath) => void
    imageDirectory: string
    projectUploadFolder: string
    onMoveNodeOrLeafTo: IMoveNodeOrLeafToMethod
}

export const IncredibleEditor = (div: IPros) => {
    const arr: Array<string | number> = []
    return makeItem(div.data, arr)
}

const makeItem = ({style, type, children}: IIncredibleItem, path: IObjectPath) => (
    <div className={'w-page ' + getClassName(type)} style={style}>
        {makeContainers(children, path)}
    </div>
)

const makeContainers = (items: Array<IIncredibleItem>, path: IObjectPath) => {
    return items.map((item, i) => {
        const currentPath = path.concat([i])
        switch (item.type) {
            case types.row:
            case types.col: {
                return (
                    <div key={i} className={'nested-row ' + getClassName(item.type)} style={item.style}>
                        {item.children ? makeContainers(item.children, currentPath) : makeComponent(item, currentPath)}
                    </div>
                )
            }
            case types.p: {
                return (
                    <p key={i} className={'nested-p ' + getClassName(item.type)} style={item.style}>
                        {item.children ? makeContainers(item.children, currentPath) : makeComponent(item, currentPath)}
                    </p>
                )
            }
            default: {
                return makeComponent(item, currentPath)
            }
        }
    })
}

const makeComponent = (item: IIncredibleItem, path: IObjectPath) => {
    /*console.log('mc ' + path)
    console.log(item)*/
    switch (item.type) {
        case types.pdf: {
            const lastSlash = item.file.lastIndexOf('/')
            if (lastSlash === -1) {
                throw new Error("can't build pdf viewer , could not find last slash in" + item.file)
            }
            const fixedPath = '/easyecom' + item.file.substring(lastSlash)

            return (
                <PdfViewer file={fixedPath} />
                /*<div>
                    <img style={{width: '100px', objectFit: 'contain'}} src={pdfIconSrc} alt={'pdf-' + item.file} />
                    <span>{item.file}</span>
                </div>*/
            )
        }
        /*case types.a: {
            return <> </>
        }*/
        case types.h1:
        case types.h2: {
            /* return <div> {item.children[0].text} </div>*/
            return <RTE path={path} node={item} />
        }

        case types.linkWithIcon: {
            return (
                <a href={item.href} placeholder={item.placeholder}>
                    <FontAwesomeIcon size={item.size} icon={faIcons[item.icon]} />
                    <span>{item.text}</span>
                </a>
            )
        }
        default: {
            //todo improve this
            if (item.br) {
                console.log('making BR')
                return <br />
            }

            return <RTE path={path} node={getParagraph(item.text)} />
        }
    }
}

const getParagraph = (text: string): INode => ({type: 'paragraph', children: [{text}]})

interface IRTE {
    node: INode
    path: IObjectPath
}

const RTE = ({node, path}: IRTE) => {
    const isDebug = useContext(MainContext).isDebug

    return (
        <>
            <RTEditor
                style={{backgroundColor: 'black', border: '3px solid red'}}
                onChange={(richTextData) => {
                    //this.richTextData = richTextData
                }}
                onBlur2={(data: INode[]) => {
                    //this.props.onObjectChange(data, path)
                }}
                data={[node]}
            />
            {isDebug && <span> {path} </span>}
        </>
    )
}

/*
const row = () => {
    <div key={i} className={'nested ' + getClassName(item.type)} style={item.style}>
        {item.children ? makeItems(item.children) : <div> component here </div>}
    </div>
}*/

export default IncredibleEditor
