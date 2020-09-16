import Shapes from '../../../generic/Shapes'
import {IPage} from '../../../../../shared/typings'
import {Link} from '@reach/router'
import * as React from 'react'
import './PageItem.css'
import {DragHandle} from '../../../generic/Drag/DragHandle'
import {DeleteForeverIcon} from '../../../generic/icons'

interface IProps {
    page: IPage
    onDeletePage: (pageID: number) => void
    onPageChange: (page: IPage) => void
}

class PageItem extends React.Component<IProps> {
    render = () => {
        const page = this.props.page
        const {id, isDeletable = true} = this.props.page

        return (
            <div className="page-and-button-controls">
                <div className={'page-buttons'}>
                    <DragHandle />
                    {isDeletable && (
                        <button
                            className="delete-page-button"
                            title="Delete Page"
                            onClick={() => this.props.onDeletePage(id)}>
                            <DeleteForeverIcon />
                        </button>
                    )}
                </div>

                <Link onClick={() => this.props.onPageChange(page)} to={`edit/${page.path}`}>
                    {page.name}
                </Link>
            </div>
        )
    }
}

export default PageItem
