import {IPage, ISection, PageEditors} from '../../../typings'
import * as React from 'react'
import SectionEditor from '../SectionEditor/SectionEditor'
import {cloneDeep, isEqual} from 'lodash'
import {RouteComponentProps, Link} from '@reach/router'

type IProps = {
    page: IPage
    save: (page: IPage) => void
    onSectionChange: (text: string, objectPath: any[]) => void
    cancel: () => void
} & RouteComponentProps // routable

interface IState {
    name: string
    path: string
    sections?: ISection[]
}

class PageEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        const {name, path} = props.page
        this.state = {name, path}
    }

    update = (event) => {
        /*   event.preventDefault()
        const {name, path} = this.state
        if (path.trim() !== '' && name.trim() !== '') {
            const page = (cloneDeep(this.props.page) as unknown) as IPage
            // update sections if they changed
            if (this.state.sections !== null && !isEqual(this.state.sections, this.props.page.sections)) {
                page.sections = this.state.sections
            }
            this.props.save({...page, name, path})
        } else {
            alert('fill in all values')
        }*/
    }

    render = () => {
        const {name, path} = this.state

        return (
            <div>
                <h2>
                    Editing {name}
                    <Link to="/pages" replace>
                        {' '}
                        {'<'} Back
                    </Link>
                </h2>
                <form
                    onSubmit={(event) => {
                        this.update(event)
                    }}>
                    <input
                        value={name}
                        type="text"
                        placeholder="Name"
                        onChange={(e) => {
                            this.setState({name: e.target.value})
                        }}
                    />
                    <input
                        value={path}
                        type="text"
                        placeholder="Path"
                        onChange={(e) => {
                            this.setState({path: e.target.value})
                        }}
                    />
                    <button type="submit">Update</button>
                </form>
                {this.getEditor()}
            </div>
        )
    }

    updateSections = (text, objectPath) => this.props.onSectionChange(text, objectPath)

    getEditor = () => {
        if (!this.props.page) {
            return <div> Page is null </div>
        }
        switch (this.props.page.editor) {
            case PageEditors.sectionEditor: {
                return (
                    <SectionEditor
                        onUpdate={(text, objectPath) => this.updateSections(text, objectPath)}
                        sections={this.props.page.sections}
                    />
                )
            }
            default: {
                return <div> No Editor</div>
            }
        }
    }
}

export default PageEditor
