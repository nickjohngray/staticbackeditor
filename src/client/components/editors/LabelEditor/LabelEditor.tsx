import * as React from 'react'
import './LabelEditor.css'
import {isEqual} from 'lodash'
import {Constants, isPrimitive} from '../../../util'
import {IFieldDataType} from '../../../../shared/typings'
import RTEditor from '../RichTextEditor/RTEditor'
import RichText from '../RichTextEditor/RichText'
import {Node as INode} from 'slate'

interface IProps {
    value: any
    // todo make value like below
    //value: string | INode[]
    onUpdate: (strinfOrINode: any) => void
    onDelete?: () => void
    label?: string
    // we need a default value for this
    type?: IFieldDataType
    richTextStyle?: {}
}

interface IState {
    isEditMode: boolean
    value: any
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
                            style={this.props.richTextStyle}
                            onChange={(richTextData) => {
                                this.updateRichTextDataAfterChange(richTextData)
                            }}
                            onBlur={() => {
                                console.log('here')
                                this.stopEdit()
                            }}
                            //todo make prop type INode | string for value
                            data={this.getRichTextBoxValue()}
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

    getRichTextBoxValue = () => (isPrimitive(this.props.value) ? JSON.parse(this.props.value) : this.props.value)

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
            {this.props.type === Constants.richText ? (
                /* todo next remove parse and set json as object in manifest*/
                <RichText style={this.props.richTextStyle} json={this.getRichTextBoxValue()} />
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

    updateRichTextDataAfterChange = (richTextData: any) => {
        this.setState({value: richTextData})
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
