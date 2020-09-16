import React, {PropsWithChildren, Ref} from 'react'
import {css, cx} from 'emotion'
import {IBaseProps, Menu, OrNull} from '../RTEditorUtil'
import {RTMarkButton} from './RTMarkButton'
import {useEditor} from 'slate-react'
import {insertImage} from '../RTEditor'
import {
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
            <RTMarkButton format="bold" Icon={FormatBoldIcon} />
            <RTMarkButton format="italic" Icon={FormatItalicIcon} />
            <RTMarkButton format="underline" Icon={FormatUnderlinedIcon} />
            <RTMarkButton format="code" Icon={CodeIcon} />
            <RTBlockButton format="heading-one" Icon={LooksOneIcon} />
            <RTBlockButton format="heading-two" Icon={LooksTwoIcon} />
            <RTBlockButton format="block-quote" Icon={FormatQuoteIcon} />
            <RTBlockButton format="numbered-list" Icon={FormatListNumberdIcon} />
            <RTBlockButton format="bulleted-list" Icon={FormatListBulletedIcon} />
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
