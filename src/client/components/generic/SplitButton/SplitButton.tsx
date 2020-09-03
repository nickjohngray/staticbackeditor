import * as React from 'react'
import './SplitButton.css'
import Shapes from '../Shapes'

interface IItem {
    label: string
    id: number
}

interface IProps {
    items: IItem[]
    onClick: (id: number) => void
}

class SplitButton extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
        if (this.props.items.length === 0) {
            throw new Error('your split button has no items')
        }
    }
    render = () => (
        <span className="split_button">
            <button className="btn" onClick={() => this.props.onClick(0)}>
                <>
                    <span>+</span>
                    <span> {this.props.items[0].label} </span>
                </>
            </button>

            <div className="dropdown">
                <button className="btn">
                    <Shapes.CaretDown />
                </button>
                <div className="dropdown-content">
                    {this.props.items.map((item, index) => {
                        if (index === 0) {
                            return <React.Fragment key={index} />
                        }
                        return (
                            <button className="btn" key={index} onClick={() => this.props.onClick(item.id)}>
                                <>
                                    <span>+</span>
                                    <span> {item.label} </span>
                                </>
                            </button>
                        )
                    })}
                </div>
            </div>
        </span>
    )
}

export default SplitButton
