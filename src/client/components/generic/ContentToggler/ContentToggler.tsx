import React from 'react'

export type IProps = {
    title: string
    className?: string
    children: any
}

interface IState {
    isVisible: boolean
}

class ContentToggler extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {isVisible: false}
    }

    render = () => {
        return (
            <div className={this.props.className}>
                <button
                    className={this.props.className + '_button'}
                    onClick={() => this.setState({isVisible: !this.state.isVisible})}>
                    {this.props.title}
                </button>
                {this.state.isVisible && <div className={this.props.className + '_content'}>{this.props.children}</div>}
            </div>
        )
    }
}

export default ContentToggler
