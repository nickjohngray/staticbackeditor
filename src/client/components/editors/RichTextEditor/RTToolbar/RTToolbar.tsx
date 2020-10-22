import React, {PropsWithChildren, Ref, useState} from 'react'
import {RGBColor as IRGBColor} from 'react-color'
import {ReactEditor, useSelected, useFocused, useSlate} from 'slate-react'
import {Transforms, Location, Editor, Text} from 'slate'
import {IBaseProps, isMarkActive, Menu, OrNull, toggleMark} from '../RTEditorUtil'
import {ColorPicker, convertToColorObject} from './ColorPicker/ColorPicker'
import {RTMarkButton} from './RTMarkButton'
import './RTToolbar.css'
import {cloneDeep} from 'lodash'

import {
    AlignCenterIcon, AlignJustifyIcon,
    AlignLeftIcon, AlignRightIcon,
    CodeIcon, ColorIcon,
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
    (props: PropsWithChildren<IBaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => {
        const [isColorPickerVisible, setIsColorPickerVisible] = useState(false)

        const editor = useSlate()
        const [selection, setSelection] = useState(editor.selection)
        const [color, setColor] = useState(null)

        return (
            <Menu
                {...props}
                ref={ref}
                className="rte-toolbar">
                <RTMarkButton format="color" onClick={() => {
                    setSelection(cloneDeep(editor.selection))

                    const [match] = Editor.nodes(editor, { match: Text.isText })
                    if(!!match) {
                        const [node, nodePath] = match
                        setColor(node.color)
                    }
                    setTimeout(() => {
                        setIsColorPickerVisible(!isColorPickerVisible)

                    }, 1)
                }

                } Icon={ColorIcon}/>
                <RTMarkButton format={'align'} value={align.alignLeft} Icon={AlignLeftIcon}/>
                <RTMarkButton format={'align'} value={align.alignCenter} Icon={AlignCenterIcon}/>
                <RTMarkButton format={'align'} value={align.alignRight} Icon={AlignRightIcon}/>
                <RTMarkButton format={'align'} value={align.alignJustify} Icon={AlignJustifyIcon}/>
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
                {isColorPickerVisible && <ColorPicker color={ convertToColorObject(color)} onDone={(color) => {

                    const colorAsRgbaString = `rgb(${color.r},${color.g},${color.b},${color.a})`
                    ReactEditor.focus(editor)
                    // Transforms.select(editor, selection)

                    setTimeout(() => {
                        Transforms.select(editor, selection)
                        toggleMark(editor, 'color', colorAsRgbaString)
                        setIsColorPickerVisible(false)
                    }, 1)
                }}
                />}
            </Menu>
        )
    }
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
