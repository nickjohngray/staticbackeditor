import {IPage} from '../../../typings'
import * as React from 'react'

interface IProps {
    page: IPage
    save: (page: IPage) => void
    cancel: () => void
}

interface IState {
    name: string
    path: string
}

class PageEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        const {name, path} = props.page
        this.state = {name, path}
    }

    save = (event) => {
        event.preventDefault()
        const {name, path} = this.state
        if (path.trim() !== '' && name.trim() !== '') {
            this.props.save({...this.props.page, name, path})
        } else {
            alert('fill in all values')
        }
    }

    render = () => {
        const {name, path} = this.state

        return (
            <form
                onSubmit={(event) => {
                    this.save(event)
                }}>
                <input
                    value={name}
                    type='text'
                    placeholder='Name'
                    onChange={(e) => {
                        this.setState({name: e.target.value})
                    }}
                />
                <input
                    value={path}
                    type='text'
                    placeholder='Path'
                    onChange={(e) => {
                        this.setState({path: e.target.value})
                    }}
                />
                <button type='submit'>Save</button>
                <button type='button' onClick={() => this.props.cancel()}>
                    Cancel
                </button>
            </form>
        )
    }
}

export default PageEditor
