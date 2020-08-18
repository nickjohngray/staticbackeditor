import * as React from 'react'
import {RouteComponentProps} from '@reach/router'
import {Direction, DOWN, IManifest, UP, IPage} from '../../../typings'
import './Pages.css'
import {Dispatch} from 'redux'
import {Istore} from '../../../redux/store'
import {
    addPage,
    deletePage,
    movePage,
    saveManifest,
    triggerUndoableStart,
    updatePage
} from '../../../redux/actions/manifest.action'
import {connect} from 'react-redux'
import Loader from '../../pages/Loader/Loader'
import PageEditor from '../PageEditor/PageEditor'

type IProps = RouteComponentProps & {
    manifest: IManifest
    movePage: (pageName: string, direction: Direction) => void
    addPage: (pageName: string, pagePath: string) => void
    deletePage: (pageName: string) => void
    updatePage: (page: IPage, originalPageName: string) => void
    loadManifest: () => void
    saveManifest: (repoName: string, manifest: IManifest) => void
    isSaved: boolean
    isBusy: false
    triggerUndoableStart: () => void
}

interface IState {
    pageName: string
    pagePath: string
    isDirty: boolean
    currentPage: IPage
}

class Pages extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            pageName: '',
            pagePath: '',
            isDirty: false,
            currentPage: null
        }
    }

    componentDidMount = () => this.props.triggerUndoableStart()

    loadEditor = (page: IPage) => {
        this.setState({currentPage: page})
    }

    pageExists = (pageName: string): boolean => {
        const page = this.getPage(pageName)
        return !!page
    }

    // all values filled and the page does not exist
    isFormOk = () =>
        this.state.pageName.trim() !== '' && this.state.pagePath.trim() !== '' && !this.pageExists(this.state.pageName)

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

    savePage = (modifiedPage: IPage) => {
        window.alert('saving page ' + modifiedPage.name)
        if (this.pageExists(modifiedPage.name)) {
            alert('This Page already Exist, choose a different name')
            return
        }
        this.props.updatePage(modifiedPage, this.state.currentPage.name)

        this.clearCurrentPage()
    }

    cancelPageEdit = () => {
        this.clearCurrentPage()
    }

    clearCurrentPage = () => this.setState({currentPage: null})

    render = () => {
        if (this.state.currentPage) {
            return <PageEditor page={this.state.currentPage} cancel={this.cancelPageEdit} save={this.savePage} />
        }

        const {
            manifest: {repoName, pages}
        } = this.props
        const {pageName, pagePath} = this.state

        return (
            <div className="pages_container">
                {this.props.isBusy && <Loader />}
                <div className="pages">
                    <h2> Pages </h2>
                    {pages.map((page, key) => (
                        <div className="page-and-button-controls" key={key + page.name}>
                            <div className={'page-button-movers'}>
                                <button title="Delete Page" onClick={() => this.props.deletePage(page.name)}>
                                    {' '}
                                    <Shapes.Cross />{' '}
                                </button>

                                {key > 0 ? (
                                    <button
                                        title="Move Page Up or more left on the menu"
                                        onClick={() => this.props.movePage(page.name, UP)}>
                                        {' '}
                                        <Shapes.UpArrow />{' '}
                                    </button>
                                ) : (
                                    <div className={'page-button-movers-placeholder'}></div>
                                )}
                                {key < pages.length - 1 ? (
                                    <button
                                        title="Move Page Down or  more right on the menu"
                                        onClick={() => this.props.movePage(page.name, DOWN)}>
                                        {' '}
                                        <Shapes.DownArrow />{' '}
                                    </button>
                                ) : (
                                    <div className={'page-button-movers-placeholder '}></div>
                                )}
                            </div>
                            <div className="page-name" onClick={() => this.loadEditor(page)}>
                                {' '}
                                {page.name}{' '}
                            </div>
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
                                value={pageName}
                                onChange={(e) => this.setState({pageName: e.target.value})}
                            />
                            {this.getPageNameMessage() || <Shapes.Tick />}
                        </div>

                        <div className="form_element">
                            <input
                                placeholder="Page Path"
                                type="text"
                                value={pagePath}
                                onChange={(e) => this.setState({pagePath: e.target.value})}
                            />
                            {pagePath.trim() === '' ? (
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
                                onClick={() => this.props.addPage(pageName, pagePath)}></input>

                            {this.isFormOk() && <Shapes.Tick />}
                            <div>
                                <input
                                    value="Save"
                                    type="button"
                                    disabled={!this.props.isSaved}
                                    onClick={() => this.props.saveManifest(repoName, this.props.manifest)}></input>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const Shapes = {
    Tick: () => <span className="shape_tick">&#10004;</span>,
    DownArrow: () => <span className="shape_down_arrow">&#x2B07;</span>,
    UpArrow: () => <span className="shape_up_arrow">&#x2B06;</span>,
    Cross: () => <span className="shape_up_arrow">&#10016;</span>
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updatePage: (page: IPage, originalPageName: string) => dispatch(updatePage(page, originalPageName)),
    movePage: (pageName: string, direction: Direction) => dispatch(movePage(pageName, direction)),
    addPage: (pageName: string, pagePath: string) => dispatch(addPage(pageName, pagePath, getPageTemplate(pageName))),
    deletePage: (pageName: string) => dispatch(deletePage(pageName)),
    saveManifest: (repoName: string, manifest: IManifest) => dispatch(saveManifest(manifest)),
    triggerUndoableStart: () => dispatch(triggerUndoableStart())
})

export default connect(
    (state: Istore) => ({
        manifest: state.manifest.present.manifest,
        isSaved: state.manifest.present.isSaved,
        isBusy: state.manifest.present.isBusy
    }),
    mapDispatchToProps
)(Pages)

const getPageTemplate = (pageName: string) => {
    return `import React from 'react'

export default () => (
    <div className={'page center-it'}>
        <h1>${pageName}</h1>
    </div>
)`
}
