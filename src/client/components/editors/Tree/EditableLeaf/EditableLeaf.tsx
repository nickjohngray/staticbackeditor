import * as React from 'react'
import './EditableLeaf.css'

interface IProps {
    value: string
    onUpdate: (text: string) => void
    elementPath: string[]
}

interface IState {
    isEditMode: boolean
    value: string
}

class EditableLeaf extends React.Component<IProps, IState> {
    realText: HTMLInputElement
    constructor(props) {
        super(props)

        this.state = {isEditMode: false, value: this.props.value}
    }

    updateStateAfterTextChange = (event) => {
        this.setState({value: event.target.value})
        this.props.onUpdate(event.target.value)
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (!prevState.isEditMode && this.state.isEditMode) {
            this.realText.focus()
            this.realText.setSelectionRange(0, this.props.value.length)
        }
    }

    toggleEditMode = () => {
        const isEditMode = !this.state.isEditMode
        this.setState({isEditMode})
    }

    maybeUpdateValue = (event) => {
        if (event.key === 'Enter') {
            this.toggleEditMode()
        }
    }

    render = () => {
        return (
            <li className="leaf">
                {this.state.isEditMode ? (
                    <input
                        className="leaf_in_edit_mode"
                        onBlur={() => this.toggleEditMode()}
                        onChange={(event) => this.updateStateAfterTextChange(event)}
                        value={this.state.value}
                        ref={(elm: HTMLInputElement) => (this.realText = elm)}
                        onKeyUp={(event) => this.maybeUpdateValue(event)}
                    />
                ) : (
                    <div className="leaf_in_view_mode" onClick={() => this.toggleEditMode()}>
                        {this.state.value}
                    </div>
                )}
            </li>
        )
    }
}

export default EditableLeaf
