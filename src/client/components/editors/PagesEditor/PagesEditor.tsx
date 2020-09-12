import {IManifest, IPage, IObjectPath} from '../../../../shared/typings'
import * as React from 'react'
import {Link, RouteComponentProps} from '@reach/router'
import Shapes from '../../generic/Shapes'
import {SortableContainer, SortableElement, SortEvent, SortEventWithTag} from 'react-sortable-hoc'
import './PagesEditor.css'
import PageItem from './PageItem'
import {isDragHandle} from '../../generic/Drag/DragHandle'
import Add from '@material-ui/icons/Add'

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

    render = () => (
        <div className="dashboard">
            <div className="pages">
                {/*  <h2> Pages </h2>*/}
                <SortableList
                    helperClass={'page_item_while_dragged'}
                    shouldCancelStart={(event: SortEvent | SortEventWithTag) => {
                        return !isDragHandle(event.target as HTMLElement)
                    }}
                    items={this.getPageItems()}
                    onSortEnd={this.onSortEnd}
                />
            </div>
            <div className="add_page">
                {/*<h2> New Page </h2>*/}
                <form>
                    <div className="form_element">
                        <input
                            placeholder="Page Name"
                            type="text"
                            value={this.state.pageName}
                            onChange={(e) => this.setState({pageName: e.target.value})}
                        />
                        {/* {this.getPageNameMessage() || <Shapes.Tick />}*/}
                    </div>

                    <div className="form-controls">
                        <button
                            type="button"
                            disabled={!this.isFormOk()}
                            // to do check for special chars
                            onClick={() => {
                                this.props.onAddPage(this.state.pageName, this.state.pageName)
                                this.setState({pageName: ''})
                            }}>
                            {' '}
                            <Add />{' '}
                        </button>
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
