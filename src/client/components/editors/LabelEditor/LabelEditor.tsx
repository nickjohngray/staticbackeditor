import * as React from 'react'
import './LabelEditor.css'
import {isEqual} from 'lodash'
import {Constants} from '../../../util'
import {IFieldDataType} from '../../../../shared/typings'
import RTEditor from '../RichTextEditor/RTEditor'
import RichText from '../RichTextEditor/RichText'

interface IProps {
    value: string
    onUpdate: (text: string) => void
    onDelete?: () => void
    label?: string
    // we need a default value for this
    type?: IFieldDataType
}

interface IState {
    isEditMode: boolean
    value: string
}

class LabelEditor extends React.Component<IProps, IState> {
    static defaultProps = {
        type: Constants.string
    }
    inputBox: HTMLInputElement

    constructor(props) {
        super(props)

        this.state = {isEditMode: false, value: this.props.value}
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.props.type === Constants.string) {
            if (!prevState.isEditMode && this.state.isEditMode) {
                this.inputBox.focus()
                if (this.inputBox.type === 'text') {
                    this.inputBox.setSelectionRange(0, this.props.value.length)
                }
            }
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (!isEqual(nextProps.value, this.props.value)) {
            this.setState({value: nextProps.value})
        }
    }

    render = () => {
        if (this.props.type !== Constants.readonly) {
            if (this.state.isEditMode) {
                if (this.props.type === Constants.number || this.props.type === Constants.string) {
                    return (
                        <input
                            type={this.props.type === Constants.number ? 'number' : 'text'}
                            className="editable_label_in_edit_mode"
                            onBlur={() => this.stopEdit()}
                            onChange={(event) => this.updateValueAfterTextChange(event)}
                            value={this.state.value}
                            ref={(elm: HTMLInputElement) => (this.inputBox = elm)}
                            onKeyUp={(event) => this.maybeUpdateValue(event)}
                            placeholder={this.props.label}
                        />
                    )
                }
                if (this.props.type === Constants.richText) {
                    return (
                        <RTEditor
                            onChange={(html) => {
                                this.updateHTMLAfterChange(html)
                            }}
                            onBlur={() => {
                                console.log('here')
                                this.stopEdit()
                            }}
                            html={JSON.parse(this.props.value)}
                        />
                    )
                }
            }
        }

        return (
            <>
                {this.props.onDelete && (
                    <button
                        className="editable_label_delete_button"
                        title="delete"
                        onClick={() => this.props.onDelete()}>
                        X
                    </button>
                )}
                <span
                    className={
                        this.props.type === 'readonly'
                            ? 'editable_label_in_readonly_mode'
                            : 'editable_label_in_view_mode'
                    }
                    onClick={() => this.props.type !== 'readonly' && this.toggleEditMode()}>
                    {this.getLabelAndValue()}
                </span>
            </>
        )
    }

    getLabelAndValue = () => {
        if (this.props.label) {
            return (
                <>
                    {this.getLabel()} {this.getSpacer()} {this.getValue()}
                </>
            )
        }
        return this.getValue()
    }

    getLabel = () => <span className="editable_label_label">{this.props.label}</span>

    getSpacer = () => <span className="editable_label_spacer"> : </span>

    getValue = () => (
        <span
            className={
                this.props.type === Constants.richText ? 'editable_label_value_rich_text' : 'editable_label_value'
            }>
            {' '}
            {this.props.type === Constants.richText ? (
                <RichText json={JSON.parse(this.props.value)} />
            ) : this.props.type === Constants.number ? (
                '$' + this.state.value
            ) : (
                this.state.value
            )}
        </span>
    )

    updateValueAfterTextChange = (event) => {
        this.setState({value: event.target.value})
    }

    updateHTMLAfterChange = (html: string) => {
        this.setState({value: html})
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
}

export default LabelEditor
