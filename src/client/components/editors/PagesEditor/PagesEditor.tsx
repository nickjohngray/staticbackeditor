import {ActionCreators} from "redux-undo"
import {IManifest, IPage} from '../../../../shared/typings'
import * as React from 'react'
import { RouteComponentProps} from '@reach/router'
import store from '../../../redux/store'
import {AddIcon} from '../../generic/icons'
import {SortableContainer, SortableElement, SortEvent, SortEventWithTag} from 'react-sortable-hoc'
import './PagesEditor.css'
import PageItem from './PageItem'
import {isDragHandle} from '../../generic/Drag/DragHandle'

interface IState {
    pageName: string
}

type IProps = {
    onDeletePage: (pageID: number) => void
    onPageChange: (page: IPage) => void
    onMovePageTo: (fromIndex: number, toIndex: number) => void
    manifest: IManifest
    onAddPage: (pageName: string, pagePath: string) => void
    isSaved: boolean
} & RouteComponentProps // routable

export class PagesEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            pageName: ''
        }
    }

    componentDidMount() {
        // reset redo, for new page we dont want these things to
        // be undone when they leave here
        store.dispatch(ActionCreators.clearHistory())
    }

    render = () => (
        <div className="dashboard">
            <div className="pages">
                {this.renderNewComponent()}
                <SortableList
                    helperClass={'page_item_while_dragged'}
                    shouldCancelStart={(event: SortEvent | SortEventWithTag) => {
                        return !isDragHandle(event.target as HTMLElement)
                    }}
                    items={this.getPageItems()}
                    onSortEnd={this.onSortEnd}
                />
            </div>
        </div>
    )

    renderNewComponent = () => (
        <div className="add_page">
            {/*<h2> New Page </h2>*/}
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    this.maybeAddPage()
                }}>
                <div className="form_element">
                    <input
                        placeholder="Click & enter new page name..."
                        type="text"
                        value={this.state.pageName}
                        onChange={(e) => this.setState({pageName: e.target.value})}
                    />
                    {/* {this.getPageNameMessage() || <Shapes.Tick />}*/}
                </div>

                <div className="form-controls">
                    <button title="Add New page"
                        type="button"
                        disabled={!this.isFormOk()}
                        onClick={() => {
                            this.maybeAddPage()
                        }}>
                        <AddIcon/>
                    </button>
                </div>
            </form>
        </div>
    )

    maybeAddPage = () => {
        if (!this.isFormOk()) {
            return
        }
        this.props.onAddPage(this.state.pageName, this.state.pageName)
        this.setState({pageName: ''})
    }

    getPageItems = () =>
        this.props.manifest.pages.map((page, key) => <PageItem key={page.id + '-' + key} page={page} {...this.props} />)

    onSortEnd = ({oldIndex, newIndex}) => this.props.onMovePageTo(oldIndex, newIndex)

    pageExists = (pageName: string): boolean => {
        const page = this.getPage(pageName)
        return !!page
    }

    getPageNameMessage = () => {
        if (this.state.pageName.trim() === '') {
            return 'Page name is requied'
        }
        if (this.pageExists(this.state.pageName)) {
            return this.state.pageName + ' already exist'
        }
        return null
    }

    getPage = (pageName: string) =>
        this.props.manifest.pages.find((page) => pageName.toUpperCase() === page.name.toUpperCase())

    // all values filled and the page does not exist
    isFormOk = () => {
        if (this.state.pageName.trim() === '') {
            return false
        }

        if (this.pageExists(this.state.pageName)) {
            return false
        }

        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        if (format.test(this.state.pageName)) {
            return false
        }
        return true
    }
}

const SortableItem = SortableElement(({value}) => <li>{value}</li>)

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={'item-' + index + '-' + value} index={index} value={value} />
            ))}
        </ul>
    )
})
