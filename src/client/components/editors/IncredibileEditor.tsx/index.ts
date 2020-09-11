import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React from 'react'
import {SizeProp as IFontAwesomeSize} from '@fortawesome/fontawesome-svg-core'

export {default} from './IncredibleEditor'

export type IIncredibleItem = {
    title: string
    br: boolean
    file: string
    size?: IFontAwesomeSize
    style: {}
    type: ITypes
    children: Array<IIncredibleItem>
    href?: string
    placeholder?: string
    icon?: string
    text?: string
}

export type ITypes = 'row' | 'col' | 'h1' | 'h2' | 'linkWithIcon' | 'text' | 'pdf' | 'p' | 'a'

export enum types {
    row = 'row',
    col = 'col',
    h1 = 'h1',
    h2 = 'h2',
    text = 'text',
    linkWithIcon = 'linkWithIcon',
    pdf = 'pdf',
    p = 'p',
    a = 'a'
}

export enum classNames {
    row = 'ie-row',
    col = 'ie-col'
}

export const getClassName = (type: ITypes): string => {
    switch (type) {
        case types.row: {
            return classNames.row
        }
        case types.col: {
            return classNames.col
        }
        case types.p: {
            return ''
        }
    }
}
