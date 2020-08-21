import * as React from 'react'
import {RouteComponentProps, Router} from '@reach/router'
import {Direction, IManifest, IPage} from '../../../typings'
import './PagesDashboard.css'
import {Dispatch} from 'redux'
import {Istore} from '../../../redux/store'
import {
    addPage,
    deletePage,
    deleteObjectByObjectPath,
    movePage,
    triggerUndoableStart,
    updatePage,
    updateTextByObjectPath
} from '../../../redux/actions/manifest.action'
import {connect} from 'react-redux'
import Loader from '../../pages/Loaders/OrbLoader/OrbLoader'
import PageEditor from '../PageEditor/PageEditor'
import {Pages} from './Pages'
import {setCurrentPage} from '../../../redux/actions/ui.actions'
import {isEqual} from 'lodash'
import {findPageById} from '../../../util'

type IProps = RouteComponentProps & {
    manifest: IManifest
    movePage: (pageID: number, direction: Direction) => void
    addPage: (pageName: string, pagePath: string) => void
    deletePage: (pageID: number) => void
    updatePage: (id: number, name: string, path: string) => void
    loadManifest: () => void
    isSaved: boolean
    isBusy: false
    triggerUndoableStart: () => void
    updateSection: (page: IPage, text: string, objectPath: any[]) => void
    deleteObjectByObjectPath: (page: IPage, objectPath: any[]) => void
    setCurrentPage: (currentPage: IPage) => void
    currentPage: IPage
}

interface IState {
    isDirty: boolean
}

// tslint:disable-next-line:max-classes-per-file
class PagesDashboard extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            isDirty: false
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (!this.props.currentPage) {
            return
        }
        if (!isEqual(nextProps.manifest, this.props.manifest)) {
            const page = findPageById(this.props.currentPage.id, nextProps.manifest.pages)
            if (!page) {
                alert('could not find page with name ' + this.props.currentPage.name.toUpperCase())
            }
            this.props.setCurrentPage(page)
        }
    }

    componentDidMount = () => this.props.triggerUndoableStart()

    render = () => (
        <div className="pages_container">
            {this.props.isBusy && <Loader />}

            <Router>
                <Pages
                    path="/"
                    manifest={this.props.manifest}
                    isSaved={this.props.isSaved}
                    onAddPage={this.props.addPage}
                    onDeletePage={this.props.deletePage}
                    onPageChange={this.props.setCurrentPage}
                    onMovePage={this.props.movePage}
                />

                <PageEditor
                    path="edit"
                    onSectionChange={(text, objectPath) => this.updateSection(text, objectPath)}
                    onSectionDelete={(objectPath) => this.deleteSection(objectPath)}
                    page={this.props.currentPage}
                    onPageNameAndPathChange={this.props.updatePage}
                />
            </Router>
        </div>
    )

    pageExists = (pageName: string): boolean => {
        const page = this.getPage(pageName)
        return !!page
    }

    updateSection = (text: string, objectPath: any[]) => {
        // @ts-ignore
        this.props.updateSection(this.props.currentPage, text, ['sections'].concat(objectPath))
    }

    deleteSection = (objectPath: any[]) => {
        // @ts-ignore
        this.props.deleteObjectByObjectPath(this.props.currentPage, ['sections'].concat(objectPath))
    }

    getPage = (pageName: string) =>
        this.props.manifest.pages.find((page) => pageName.toUpperCase() === page.name.toUpperCase())
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updatePage: (id: number, name: string, path: string) => dispatch(updatePage(id, name, path)),
    updateSection: (page: IPage, text: string, objectPath: any[]) =>
        dispatch(updateTextByObjectPath(page, text, objectPath)),
    deleteObjectByObjectPath: (page: IPage, objectPath: any[]) => dispatch(deleteObjectByObjectPath(page, objectPath)),

    movePage: (pageID: number, direction: Direction) => dispatch(movePage(pageID, direction)),
    addPage: (pageName: string, pagePath: string) => dispatch(addPage(pageName, pagePath, getPageTemplate(pageName))),
    deletePage: (pageID: number) => dispatch(deletePage(pageID)),
    triggerUndoableStart: () => dispatch(triggerUndoableStart()),
    setCurrentPage: (currentPage: IPage) => dispatch(setCurrentPage(currentPage))
})

export default connect(
    (state: Istore) => ({
        manifest: state.manifest.present.manifest,
        isSaved: state.ui.isSaved,
        isBusy: state.manifest.present.isBusy,
        currentPage: state.ui.currentPage
    }),
    mapDispatchToProps
)(PagesDashboard)

const getPageTemplate = (pageName: string) => {
    return `import React from 'react'

export default () => (
    <div className={'page center-it'}>
        <h1>${pageName}</h1>
    </div>
)`
}
