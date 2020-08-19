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
    setAnyTopLevelProperty,
    setAnyTopLevelPropertyUndoable,
    triggerUndoableStart,
    updatePage,
    updateTextByObjectPath
} from '../../../redux/actions/manifest.action'
import {connect} from 'react-redux'
import Loader from '../../pages/Loader/Loader'
import PageEditor from '../PageEditor/PageEditor'
import {isEqual} from 'lodash'

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
    updateSection: (page: IPage, text: string, objectPath: any[]) => void
    setCurrentPage: (currentPage: IPage) => void
    currentPage: IPage
}

interface IState {
    pageName: string
    pagePath: string
    isDirty: boolean
}

class Pages extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            pageName: '',
            pagePath: '',
            isDirty: false
        }
    }

    /* componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if ( !isEqual(nextProps.manifest, this.props.manifest )) {
            this.setState()
        }
    }*/

    componentDidMount = () => this.props.triggerUndoableStart()

    loadEditor = (page: IPage) => {
        this.props.setCurrentPage(page)
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
        this.props.updatePage(modifiedPage, this.props.currentPage.name)
        this.clearCurrentPage()
    }

    saveSection = (text: string, objectPath: any[]) => {
        // @ts-ignore
        this.props.updateSection(this.props.currentPage, text, ['sections'].concat(objectPath))
    }

    cancelPageEdit = () => {
        this.clearCurrentPage()
    }

    clearCurrentPage = () => this.props.setCurrentPage(null)

    render = () => {
        if (this.props.currentPage) {
            return (
                <PageEditor
                    onSectionChange={(text, objectPath) => this.saveSection(text, objectPath)}
                    page={this.props.currentPage}
                    cancel={this.cancelPageEdit}
                    save={this.savePage}
                />
            )
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
                                onClick={() => this.props.addPage(pageName, pagePath)}
                            />

                            {this.isFormOk() && <Shapes.Tick />}
                            <div>
                                <input
                                    value="Save"
                                    type="button"
                                    disabled={!this.props.isSaved}
                                    onClick={() => this.props.saveManifest(repoName, this.props.manifest)}
                                />
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
    updateSection: (page: IPage, text: string, objectPath: any[]) =>
        dispatch(updateTextByObjectPath(page, text, objectPath)),
    movePage: (pageName: string, direction: Direction) => dispatch(movePage(pageName, direction)),
    addPage: (pageName: string, pagePath: string) => dispatch(addPage(pageName, pagePath, getPageTemplate(pageName))),
    deletePage: (pageName: string) => dispatch(deletePage(pageName)),
    saveManifest: (repoName: string, manifest: IManifest) => dispatch(saveManifest(manifest)),
    triggerUndoableStart: () => dispatch(triggerUndoableStart()),
    setCurrentPage: (currentPage: IPage) => dispatch(setAnyTopLevelProperty({currentPage}))
})

export default connect(
    (state: Istore) => ({
        manifest: state.manifest.present.manifest,
        isSaved: state.manifest.present.isSaved,
        isBusy: state.manifest.present.isBusy,
        currentPage: state.manifest.present.currentPage
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
