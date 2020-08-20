import {Direction, DOWN, IManifest, IPage, UP} from '../../../typings'
import * as React from 'react'
import {Link, RouteComponentProps} from '@reach/router'
import Shapes from './../../Shapes'

interface IState {
    pageName: string
    pagePath: string
}

type IProps = {
    onDeletePage: (pageID: number) => void
    onPageChange: (page: IPage) => void
    onMovePage: (pageID: number, direction: Direction) => void
    manifest: IManifest
    onAddPage: (pageName: string, pagePath: string) => void
    isSaved: boolean
} & RouteComponentProps // routable

export class Pages extends React.Component<IProps, IState> {
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
                {this.props.manifest.pages.map((page, key) => (
                    <div className="page-and-button-controls" key={key + page.name}>
                        <div className={'page-button-movers'}>
                            <button title="Delete Page" onClick={() => this.props.onDeletePage(page.id)}>
                                <Shapes.Cross />
                            </button>

                            {key > 0 ? (
                                <button
                                    title="Move Page Up or more left on the menu"
                                    onClick={() => this.props.onMovePage(page.id, UP)}>
                                    <Shapes.UpArrow />
                                </button>
                            ) : (
                                <div className={'page-button-movers-placeholder'} />
                            )}
                            {key < this.props.manifest.pages.length - 1 ? (
                                <button
                                    title="Move Page Down or  more right on the menu"
                                    onClick={() => this.props.onMovePage(page.id, DOWN)}>
                                    <Shapes.DownArrow />
                                </button>
                            ) : (
                                <div className={'page-button-movers-placeholder '} />
                            )}
                        </div>

                        <Link onClick={() => this.props.onPageChange(page)} to="edit">
                            {page.name}
                        </Link>
                    </div>
                ))}
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
