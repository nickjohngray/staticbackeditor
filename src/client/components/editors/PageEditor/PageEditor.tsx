import {IPage, ISection, PageContentEditors} from '../../../typings'
import * as React from 'react'
import SectionEditor from '../SectionEditor/SectionEditor'
import {RouteComponentProps, Link} from '@reach/router'
import EditableLabel from '../EditableLabel/EditableLabel'

type IProps = {
    page: IPage
    onPageNameAndPathChange: (id: number, name: string, path: string) => void
    onSectionChange: (text: string, objectPath: any[]) => void
    onSectionDelete: (objectPath: any[]) => void
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

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (!nextProps.page) {
            return
        }
        if (nextProps.page.name !== this.props.page.name || nextProps.page.path !== this.props.page.path) {
            this.setState({name: nextProps.page.name, path: nextProps.page.path})
        }
    }

    render = () => {
        const {name, path} = this.state

        return (
            <div>
                <h2>
                    <Link placeholder={'Back to pages dashboard'} to="/pages" replace>
                        {'<'}
                    </Link>{' '}
                    pages {'/'} {name}
                </h2>
                <div className={'path-and-name-container'}>
                    <EditableLabel
                        placeholder="Name"
                        value={name}
                        onUpdate={(name) => {
                            this.fireUpdatePath(name)
                        }}
                    />
                    <EditableLabel
                        placeholder="Path"
                        value={path}
                        onUpdate={(path) => {
                            this.fireUpdatePath(undefined, path)
                        }}
                    />
                </div>
                {this.getContentEditor()}
            </div>
        )
    }

    getContentEditor = () => {
        if (!this.props.page) {
            return <div> Page is null </div>
        }
        switch (this.props.page.editor) {
            case PageContentEditors.sectionEditor: {
                return (
                    <SectionEditor
                        onUpdate={(text, objectPath) => this.props.onSectionChange(text, objectPath)}
                        onDelete={(objectPath) => this.props.onSectionDelete(objectPath)}
                        sections={this.props.page.sections}
                    />
                )
            }
            default: {
                return <div> No Editor</div>
            }
        }
    }

    fireOnPageNameAndPathChange = (event) => {
        const {name, path} = this.state
        if (path.trim() === '' || name.trim() === '') {
            alert('Please fill in all values')
            return
        }

        this.props.onPageNameAndPathChange(this.props.page.id, name, path)
    }

    fireUpdatePath = (name: string = this.state.name, path: string = this.state.path) => {
        if (path.trim() === '' || name.trim() === '') {
            alert('Please fill in all values')
            return
        }

        this.props.onPageNameAndPathChange(this.props.page.id, name, path)
    }
}

export default PageEditor
