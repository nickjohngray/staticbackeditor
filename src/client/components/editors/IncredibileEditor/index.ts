import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React from 'react'
import {SizeProp as IFontAwesomeSize} from '@fortawesome/fontawesome-svg-core'

export {default} from './IncredibleEditor'

export type IIncredibleItem = {
    type?: IIncredibleTypes
    title?: string
    br?: boolean
    file?: string
    size?: IFontAwesomeSize
    style?: {}
    children?: IIncredibleItem[]
    href?: string
    placeholder?: string
    icon?: string
    text?: string
}
// todo fix these names
export type IIncredibleTypes =
    | 'row'
    | 'col'
    | 'h1'
    | 'h2'
    | 'linkWithIcon'
    | 'text'
    | 'pdf'
    | 'p'
    | 'a'
    | 'richText'
    | 'heading-one'
    | 'paragraph'

export enum IncredibleTypes {
    row = 'row',
    col = 'col',
    h1 = 'h1',
    h2 = 'h2',
    text = 'text',
    linkWithIcon = 'linkWithIcon',
    pdf = 'pdf',
    p = 'p',
    a = 'a',
    richText = 'richText',
    headingOne = 'heading-one'
}

export enum classNames {
    row = 'ie-row',
    col = 'ie-col'
}

export const getClassName = (type: IIncredibleTypes): string => {
    switch (type) {
        case IncredibleTypes.row: {
            return classNames.row
        }
        case IncredibleTypes.col: {
            return classNames.col
        }
        case IncredibleTypes.p: {
            return ''
        }
        default: {
            throw new Error('this should not be hit')
        }
    }
}
