import Shapes from '../../../generic/Shapes'
import {IPage} from '../../../../../shared/typings'
import {Link, navigate} from '@reach/router'
import * as React from 'react'
import './PageItem.css'
import {DragHandle} from '../../../generic/Drag/DragHandle'
import {DeleteForeverIcon} from '../../../generic/icons'

interface IProps {
    pageID: number
    pageName: string
    onDeletePage: (pageID: number) => void
    onPageChange: (pageID: number) => void
    isPageDeletable: boolean
}

class PageItem extends React.Component<IProps> {
    render = () => {
        const { pageID,  isPageDeletable,  pageName} = this.props

        return (
            <div className="page-and-button-controls">
                <div className={'page-buttons'}>
                    <DragHandle/>
                    {isPageDeletable && (
                        <button
                            className="delete-page-button"
                            title="Delete Page"
                            onClick={() => this.props.onDeletePage(pageID)}>
                            <DeleteForeverIcon/>
                        </button>
                    )}
                </div>

               {/* <Link onClick={() => this.props.onPageChange(page)} to={`/${page.path}`}>
                    {page.name}
                </Link>*/}
              {/*  Dont change this to span or clicks wont go through*/}

              {/* the url is now changed   in the ui reducer*/}
              {<button className="page-item-button" onClick={() => {
                    this.props.onPageChange(pageID)

                }}>
                   {pageName}
                </button>}
            </div>
        )
    }
}

export default PageItem
