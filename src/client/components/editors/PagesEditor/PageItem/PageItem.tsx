import Shapes from '../../../generic/Shapes'
import {Direction, DOWN, IPage, UP} from '../../../../../shared/typings'
import {Link} from '@reach/router'
import * as React from 'react'
import './PageItem.css'

interface IProps {
    page: IPage
    onDeletePage: (pageID: number) => void
    onMovePage: (pageID: number, direction: Direction) => void
    onPageChange: (page: IPage) => void
}

class PageItem extends React.Component<IProps> {
    render = () => {
        const page = this.props.page
        const {id} = this.props.page

        return (
            <div className="page-and-button-controls">
                <div className={'page-buttons'}>
                    <div title="Click to drag page to new location" className="drag_handle">
                        |||{' '}
                    </div>
                    <button title="Delete Page" onClick={() => this.props.onDeletePage(id)}>
                        <Shapes.Cross />
                    </button>
                </div>

                <Link onClick={() => this.props.onPageChange(page)} to={`edit/${page.path}`}>
                    {page.name}
                </Link>
            </div>
        )
    }
}

export default PageItem
