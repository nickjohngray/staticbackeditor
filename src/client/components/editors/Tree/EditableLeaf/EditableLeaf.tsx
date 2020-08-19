import * as React from 'react'
import './EditableLeaf.css'
import {isEqual} from 'lodash'

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

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (!prevState.isEditMode && this.state.isEditMode) {
            this.realText.focus()
            this.realText.setSelectionRange(0, this.props.value.length)
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (!isEqual(nextProps.value, this.props.value)) {
            this.setState({value: nextProps.value})
        }
    }

    updateValueAfterTextChange = (event) => {
        this.setState({value: event.target.value})
    }

    toggleEditMode = () => {
        const isEditMode = !this.state.isEditMode
        this.setState({isEditMode})
    }

    fireUpdate = () => {
        this.props.onUpdate(this.state.value)
    }

    stopEdit = () => {
        this.setState({isEditMode: false})
        this.fireUpdate()
    }

    maybeUpdateValue = (event) => {
        if (event.key === 'Enter') {
            this.fireUpdate()
            this.stopEdit()
        }
    }

    render = () => {
        return (
            <li className="leaf">
                {this.state.isEditMode ? (
                    <input
                        className="leaf_in_edit_mode"
                        onBlur={() => this.stopEdit()}
                        onChange={(event) => this.updateValueAfterTextChange(event)}
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
