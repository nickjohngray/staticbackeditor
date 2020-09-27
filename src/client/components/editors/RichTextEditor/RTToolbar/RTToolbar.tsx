import React, {PropsWithChildren, Ref} from 'react'
import {IBaseProps, Menu, OrNull} from '../RTEditorUtil'
import {RTMarkButton} from './RTMarkButton'
import './RTToolbar.css'
import {cloneDeep} from 'lodash'

import {
    AlignCenterIcon, AlignJustifyIcon,
    AlignLeftIcon, AlignRightIcon,
    CodeIcon,
    FormatBoldIcon,
    FormatItalicIcon,
    FormatListBulletedIcon,
    FormatListNumberdIcon,
    FormatQuoteIcon,
    FormatUnderlinedIcon,
    LooksOneIcon,
    LooksTwoIcon
} from '../../../generic/icons'
import {RTBlockButton} from './RTBlockButton'

const align = {
    alignLeft: 'left',
    alignRight: 'right',
    alignCenter: 'center',
    alignJustify: 'justify'
}

export const RTToolbar = React.forwardRef(
    (props: PropsWithChildren<IBaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <Menu
            {...props}
            ref={ref}
            className="rte-toolbar">
            <RTMarkButton format={'align'} value={align.alignLeft} disableButtons={   cloneDeep(align) } Icon={AlignLeftIcon}/>
            <RTMarkButton format={'align'} value={align.alignCenter} disableButtons={align} Icon={AlignCenterIcon}/>
            <RTMarkButton format={'align'} value={align.alignRight} disableButtons={align} Icon={AlignRightIcon}/>
            <RTMarkButton format={'align'} value={align.alignJustify} disableButtons={align} Icon={AlignJustifyIcon}/>
            <RTMarkButton format="bold" Icon={FormatBoldIcon}/>
            <RTMarkButton format="italic" Icon={FormatItalicIcon}/>
            <RTMarkButton format="underline" Icon={FormatUnderlinedIcon}/>
            <RTMarkButton format="code" Icon={CodeIcon}/>
            <RTBlockButton format="heading-one" Icon={LooksOneIcon}/>
            <RTBlockButton format="heading-two" Icon={LooksTwoIcon}/>
            <RTBlockButton format="block-quote" Icon={FormatQuoteIcon}/>
            <RTBlockButton format="numbered-list" Icon={FormatListNumberdIcon}/>
            <RTBlockButton format="bulleted-list" Icon={FormatListBulletedIcon}/>
            {/*   <InsertImageButton />*/}
        </Menu>
    )
)

/*const InsertImageButton = () => {
    const editor = useEditor()
    return (
        <Button
            onMouseDown={(event) => {
                event.preventDefault()
                const url = window.prompt('Enter the URL of the image:')
                if (!url) return
                insertImage(editor, url)
            }}>
            <Icon>image</Icon>
        </Button>
    )
}*/
