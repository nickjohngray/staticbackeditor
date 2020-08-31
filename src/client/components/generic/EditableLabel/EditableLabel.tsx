import * as React from 'react'
import './EditableLabel.css'
import {isEqual} from 'lodash'
import {Constants} from '../../../util'

interface IProps {
    value: string
    onUpdate: (text: string) => void
    onDelete?: () => void
    label?: string
    type?: 'string' | 'number'
}

interface IState {
    isEditMode: boolean
    value: string
}

class EditableLabel extends React.Component<IProps, IState> {
    realText: HTMLInputElement
    constructor(props) {
        super(props)

        this.state = {isEditMode: false, value: this.props.value}
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (!prevState.isEditMode && this.state.isEditMode) {
            this.realText.focus()
            if (this.realText.type === 'text') {
                this.realText.setSelectionRange(0, this.props.value.length)
            }
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
            <>
                {this.state.isEditMode ? (
                    <input
                        type={this.props.type === Constants.number ? 'number' : 'text'}
                        className="editable_label_in_edit_mode"
                        onBlur={() => this.stopEdit()}
                        onChange={(event) => this.updateValueAfterTextChange(event)}
                        value={this.state.value}
                        ref={(elm: HTMLInputElement) => (this.realText = elm)}
                        onKeyUp={(event) => this.maybeUpdateValue(event)}
                        placeholder={this.props.label}
                    />
                ) : (
                    <>
                        {this.props.onDelete && (
                            <button
                                className="editable_label_delete_button"
                                title="delete"
                                onClick={() => this.props.onDelete()}>
                                X
                            </button>
                        )}
                        <span className="editable_label_in_view_mode" onClick={() => this.toggleEditMode()}>
                            {this.getLabel()}
                        </span>
                    </>
                )}
            </>
        )
    }

    getLabel = () => {
        if (this.props.label) {
            return this.props.label + ':' + this.state.value
        }
        return this.state.value
    }
}

export default EditableLabel
