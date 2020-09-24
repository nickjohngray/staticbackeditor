import React, {useCallback, useContext, Fragment} from 'react'
import {getClassName, IIncredibleItem, IncredibleTypes} from './index'
import './IncredibleEditor.css'
import {IMoveNodeOrLeafToMethod, IObjectPath} from '../../../../shared/typings'
import {Node as INode} from 'slate'
import MainContext from '../../../context/MainContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle, faInstagram} from '@fortawesome/free-brands-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import PdfViewer from '../../generic/PdfViewer'
import LabelEditor from '../LabelEditor/LabelEditor'

const faIcons = {
    faFacebook,
    faGoogle,
    faInstagram,
    faPhone
}

interface IPros {
    data: IIncredibleItem
    onUpdate: (textOrNode: any, objectPath: IObjectPath) => void
    onAdd: (jsonObject: object, objectPath: IObjectPath) => void
    onDelete: (objectPath: IObjectPath) => void
    assetDirectory: string
    projectUploadFolder: string
    onMoveNodeOrLeafTo: IMoveNodeOrLeafToMethod
}

export const IncredibleEditor = (props: IPros) => {
    const {data} = props
    const path: (string | number)[] = ['incredibleData']
    const RenderMe = useCallback((props: IPros) => makeContainers(data.children, path, props), [data.children])
    return (
        <div className={'ie-row w-page w-center-it ' + getClassName(data.type)} style={data.style}>
            {RenderMe(props)}
        </div>
    )
}

const makeContainers = (items: IIncredibleItem[], path: IObjectPath, props: IPros): any => {
    return items.map((item, i) => {
        const currentPath = path.concat(['children', i])
        switch (item.type) {
            case IncredibleTypes.row:
            case IncredibleTypes.col: {
                return (
                    <div key={path.toString()} className={'nested-row ' + getClassName(item.type)} style={item.style}>
                        {item.children
                            ? makeContainers(item.children, currentPath, props)
                            : makeComponent(item, currentPath, props)}
                    </div>
                )
            }
            default: {
                return makeComponent(item, currentPath, props)
            }
        }
    })
}

const makeComponent = (item: IIncredibleItem, path: IObjectPath, props: IPros) => {
    switch (item.type) {
        case IncredibleTypes.pdf: {
           /* const lastSlash = item.file.lastIndexOf('/')
            if (lastSlash === -1) {
                throw new Error("can't build pdf viewer , could not find last slash in" + item.file)
            }*/
            const fixedPath = '/' + props.assetDirectory  + '/' +  item.file //.substring(lastSlash)
            return <PdfViewer key={path.toString()} file={fixedPath} />
        }
        case IncredibleTypes.richText: {
            return <RTE key={path.toString()} path={path} node={item} props={props} />
        }
        case IncredibleTypes.linkWithIcon: {
            return (
                <div key={path.toString()} className="social-icons">
                    <a className="social-icon" href={item.href} placeholder={item.placeholder}>
                        <FontAwesomeIcon size={item.size} icon={faIcons[item.icon]} />
                        <span>{item.text}</span>
                    </a>
                </div>
            )
        }
        default: {
            throw new Error('Error this should not be hit')
        }
    }
}

interface IRTE {
    node: any // INode
    path: IObjectPath
    props: IPros
}

const RTE = ({node, path, props}: IRTE) => {
    const isDebug = useContext(MainContext).isDebug

    return (
        <>
            <LabelEditor
                richTextStyle={{backgroundColor: 'black'}}
                type={'richText'}
                onUpdate={(node: INode[]) => {
                    props.onUpdate(node, path)
                }}
                value={[node]}
            />
            {isDebug && <span> {path} </span>}
        </>
    )
}

export default IncredibleEditor
