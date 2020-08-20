import * as React from 'react'
import {RouteComponentProps, Router} from '@reach/router'
import {Direction, IManifest, IPage} from '../../../typings'
import './Pages.css'
import {Dispatch} from 'redux'
import {Istore} from '../../../redux/store'
import {
    addPage,
    deletePage,
    movePage,
    saveManifest,
    triggerUndoableStart,
    updatePage,
    updateTextByObjectPath
} from '../../../redux/actions/manifest.action'
import {connect} from 'react-redux'
import Loader from '../../pages/Loader/Loader'
import PageEditor from '../PageEditor/PageEditor'
import {PageDashboard} from './PagesDashboard'
import {setCurrentPage} from '../../../redux/actions/pages.actions'
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
    isDirty: boolean
}

// tslint:disable-next-line:max-classes-per-file
class Pages extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            isDirty: false
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (!isEqual(nextProps.manifest, this.props.manifest)) {
            const page = nextProps.manifest.pages.find(
                // tslint:disable-next-line:no-shadowed-variable
                (page) => this.props.currentPage.name.toUpperCase() === page.name.toUpperCase()
            )
            this.props.setCurrentPage(page)
        }
    }

    componentDidMount = () => this.props.triggerUndoableStart()

    render = () => {
        const {
            manifest: {repoName, pages}
        } = this.props

        return (
            <div className="pages_container">
                {this.props.isBusy && <Loader />}

                <Router>
                    <PageDashboard
                        path="/"
                        manifest={this.props.manifest}
                        isSaved={this.props.isSaved}
                        addPage={this.props.addPage}
                        deletePage={this.props.deletePage}
                        loadEditor={this.props.setCurrentPage}
                        movePage={this.props.movePage}
                        saveManifest={this.props.saveManifest}
                    />

                    <PageEditor
                        path="edit"
                        onSectionChange={(text, objectPath) => this.saveSection(text, objectPath)}
                        page={this.props.currentPage}
                        cancel={this.cancelPageEdit}
                        save={this.savePage}
                    />
                </Router>
            </div>
        )
    }

    pageExists = (pageName: string): boolean => {
        const page = this.getPage(pageName)
        return !!page
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
    setCurrentPage: (currentPage: IPage) => dispatch(setCurrentPage(currentPage))
})

export default connect(
    (state: Istore) => ({
        manifest: state.manifest.present.manifest,
        isSaved: state.manifest.present.isSaved,
        isBusy: state.manifest.present.isBusy,
        currentPage: state.pages.currentPage
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
