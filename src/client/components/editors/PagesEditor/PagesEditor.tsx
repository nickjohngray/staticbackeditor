import {Direction, DOWN, IManifest, IPage, IObjectPath, UP} from '../../../../shared/typings'
import * as React from 'react'
import {Link, RouteComponentProps} from '@reach/router'
import Shapes from '../../generic/Shapes'
import {SortableContainer, SortableElement, SortEvent, SortEventWithTag} from 'react-sortable-hoc'
import './PagesEditor.css'
import PageItem from './PageItem'

interface IState {
    pageName: string
    pagePath: string
}

type IProps = {
    onDeletePage: (pageID: number) => void
    onPageChange: (page: IPage) => void
    onMovePage: (pageID: number, direction: Direction) => void
    onMovePageTo: (fromIndex: number, toIndex: number) => void
    manifest: IManifest
    onAddPage: (pageName: string, pagePath: string) => void
    isSaved: boolean
} & RouteComponentProps // routable

export class PagesEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            pageName: '',
            pagePath: ''
        }
    }

    render = () => (
        <div className="dashboard">
            <div className="pages">
                <h2> Pages </h2>
                <SortableList
                    helperClass={'page_item_while_dragged'}
                    shouldCancelStart={(event: SortEvent | SortEventWithTag) => {
                        if ((event as SortEventWithTag).target.tagName === 'DIV') {
                            return false // the drag handle is defined in a div
                        }
                        // cancel this drag event for all other tag elements,
                        // like span, button and link, these are used for
                        // other things
                        return true
                    }}
                    items={this.getPageItems()}
                    onSortEnd={this.onSortEnd}
                />
            </div>
            <div className="add_page">
                <h2> New Page </h2>
                <form>
                    <div className="form_element">
                        <input
                            placeholder="Page Name"
                            type="text"
                            value={this.state.pageName}
                            onChange={(e) => this.setState({pageName: e.target.value})}
                        />
                        {this.getPageNameMessage() || <Shapes.Tick />}
                    </div>

                    <div className="form_element">
                        <input
                            placeholder="Page Path"
                            type="text"
                            value={this.state.pagePath}
                            onChange={(e) => this.setState({pagePath: e.target.value})}
                        />
                        {this.state.pagePath.trim() === '' ? (
                            <span className="input-message">Please enter a page path.</span>
                        ) : (
                            <Shapes.Tick />
                        )}
                    </div>
                    <div className="form-controls">
                        <input
                            value="Create Page"
                            type="button"
                            disabled={!this.isFormOk()}
                            onClick={() => this.props.onAddPage(this.state.pageName, this.state.pagePath)}
                        />

                        {this.isFormOk() && <Shapes.Tick />}
                    </div>
                </form>
            </div>
        </div>
    )

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
    isFormOk = () =>
        this.state.pageName.trim() !== '' && this.state.pagePath.trim() !== '' && !this.pageExists(this.state.pageName)
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
