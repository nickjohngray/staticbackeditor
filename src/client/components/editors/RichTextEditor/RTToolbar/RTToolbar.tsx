import React, {PropsWithChildren, Ref} from 'react'
import {css, cx} from 'emotion'
import {Button, IBaseProps, Menu, OrNull} from '../RTEditorUtil'
import {RTMarkButton} from './RTMarkButton'
import FormatBold from '@material-ui/icons/FormatBold'
import {FormatItalic} from '@material-ui/icons'
import FormatUnderlined from '@material-ui/icons/FormatUnderlined'
import Code from '@material-ui/icons/Code'
import {RTBlockButton} from './RTBlockButton'
import LooksOne from '@material-ui/icons/LooksOne'
import LooksTwo from '@material-ui/icons/LooksTwo'
import FormatQuote from '@material-ui/icons/FormatQuote'
import FormatListNumbered from '@material-ui/icons/FormatListNumbered'
import FormatListBulleted from '@material-ui/icons/FormatListBulleted'
import {useEditor} from 'slate-react'
import {insertImage} from '../RTEditor'
import {Icon} from '@material-ui/core'

export const RTToolbar = React.forwardRef(
    ({className, ...props}: PropsWithChildren<IBaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <Menu
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    position: relative;
                    padding: 0px;
                    margin: 0px;
                    border-bottom: none;
                    margin-bottom: 0px;
                `
            )}>
            <RTMarkButton format="bold" Icon={FormatBold} />
            <RTMarkButton format="italic" Icon={FormatItalic} />
            <RTMarkButton format="underline" Icon={FormatUnderlined} />
            <RTMarkButton format="code" Icon={Code} />
            <RTBlockButton format="heading-one" Icon={LooksOne} />
            <RTBlockButton format="heading-two" Icon={LooksTwo} />
            <RTBlockButton format="block-quote" Icon={FormatQuote} />
            <RTBlockButton format="numbered-list" Icon={FormatListNumbered} />
            <RTBlockButton format="bulleted-list" Icon={FormatListBulleted} />
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
