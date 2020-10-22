import React, {useState, useCallback} from 'react'
import {SketchPicker, BlockPicker, ChromePicker, CirclePicker, AlphaPicker, ColorResult, RGBColor as IRGBColor} from 'react-color'
import './ColorPicker.css'

interface IColorPickerProps {
    color?: IRGBColor
    // todo on change needs help
    onChange?: (color: IRGBColor) => void
    onDone?: (color: IRGBColor) => void
}

export const ColorPicker = ({color = {a:1,b:0,g:0,r:0}, onChange, onDone }: IColorPickerProps) => {
        const [currentColor, setCurrentColor] = useState<IRGBColor>( color)
        return (
            <div  className="colorPickerContainer">
            <SketchPicker
                className="colorPicker"
                content-around
                color={ currentColor}
                disableAlpha={false}

                onChange={ (color: ColorResult)=> {
                    setCurrentColor(color.rgb)
                    // onChange(color.rgb)
                }  }
            />
                <button onClick={ ()=> {onDone(currentColor)} } > Done</button>
           </div>
        )
}

// string should be rgb(189,16,224,1) or null
export  const convertToColorObject = (color: string) : IRGBColor | undefined => {
    // rgb(189,16,224,1)
    if(!color) {
        return undefined
    }
    let start = color.indexOf('rgb(')
    if(start === -1) {
        throw new Error('malformed color object')
    }
    start += 4 // start after rgb(
    const end = color.indexOf(')')
    const a = color.substring(start,end).split(',')
    const c : IRGBColor = {
        r:  parseInt(a[0],10),
        g: parseInt(a[1],10),
        b: parseInt(a[2],10),
        a: parseInt(a[3],10) }
    return  c
}
