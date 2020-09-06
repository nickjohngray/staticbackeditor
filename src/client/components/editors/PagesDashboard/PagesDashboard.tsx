import * as React from 'react'
import {LocationProps, navigate, RouteComponentProps, Router} from '@reach/router'
import {Direction, IManifest, IPage, IObjectPath, IMoveNodeOrLeafToMethodWithPageId} from '../../../../shared/typings'
import './PagesDashboard.css'
import {Dispatch} from 'redux'
import {IStore} from '../../../redux/store'
import {
    addPage,
    deletePage,
    deleteObjectByPath,
    movePage,
    triggerUndoableStart,
    updatePage,
    updateObjectByPath,
    addObjectByPath,
    movePageTo,
    swapObjectsByPath
} from '../../../redux/actions/manifest.action'
import {connect} from 'react-redux'
import Loader from '../../pages/Loaders/OrbLoader/OrbLoader'
import PageEditor from '../PageEditor/PageEditor'
import {PagesEditor} from '../PagesEditor/PagesEditor'
import {setCurrentPage} from '../../../redux/actions/ui.actions'
import {isEqual} from 'lodash'
import {findPageById} from '../../../util'

type IProps = RouteComponentProps & {
    manifest: IManifest
    movePage: (pageID: number, direction: Direction) => void
    movePageTo: (fromIndex: number, toIndex: number) => void
    swapObjectsByPath: IMoveNodeOrLeafToMethodWithPageId
    addPage: (pageName: string, pagePath: string) => void
    deletePage: (pageID: number) => void
    updatePage: (id: number, name: string, path: string) => void
    loadManifest: () => void
    isSaved: boolean
    isBusy: false
    triggerUndoableStart: () => void
    updateObjectByPath: (page: IPage, text: string, objectPath: any[]) => void
    addObjectByPath: (page: IPage, jsonObject: object, objectPath: any[]) => void
    deleteObjectByPath: (page: IPage, objectPath: any[]) => void
    setCurrentPage: (currentPage: IPage) => void
    currentPage: IPage
    location: LocationProps
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

    render = () => {
        // check if user hit reload browser store clear in this case
        // there will be no page on edit so go to pages
        if (!this.props.currentPage && this.props.location.pathname.indexOf('/pages/edit') !== -1) {
            return (
                <div>
                    You web browser was reloaded , your current changes will be saved from your last edit, Please click
                    Go To Pages button below and select that page again
                    {this.props.location.pathname}
                    <button onClick={() => navigate('/pages')}>Go To Pages</button>
                </div>
            )
        }

        return (
            <div className="pages_container manin-container">
                {this.props.isBusy && <Loader />}

                <Router>
                    <PagesEditor
                        path="/"
                        manifest={this.props.manifest}
                        isSaved={this.props.isSaved}
                        onAddPage={this.props.addPage}
                        onDeletePage={this.props.deletePage}
                        onPageChange={this.props.setCurrentPage}
                        onMovePage={this.props.movePage}
                        onMovePageTo={this.props.movePageTo}
                    />

                    {this.props.currentPage && (
                        <PageEditor
                            products={this.props.manifest.products}
                            path="edit/:pageID"
                            onSectionChange={(value: string, objectPath) => this.updateSection(value, objectPath)}
                            onSectionAdd={(jsonObject: object, objectPath) => this.addSection(jsonObject, objectPath)}
                            onSectionDelete={(objectPath) => this.deleteSection(objectPath)}
                            page={this.props.currentPage}
                            onPageNameAndPathChange={this.props.updatePage}
                            imageDirectory={this.props.manifest.repoName}
                            projectUploadFolder={this.props.manifest.repoName}
                            onMoveNodeOrLeafTo={(fromIndex, toIndex, objectPath, fromField, toField) =>
                                this.props.swapObjectsByPath(
                                    fromIndex,
                                    toIndex,
                                    objectPath,
                                    this.props.currentPage.id,
                                    fromField,
                                    toField
                                )
                            }
                        />
                    )}
                </Router>
            </div>
        )
    }

    pageExists = (pageName: string): boolean => {
        const page = this.getPage(pageName)
        return !!page
    }

    updateSection = (value: string, objectPath: IObjectPath) => {
        this.props.updateObjectByPath(this.props.currentPage, value, objectPath)
    }

    addSection = (jsonObject: object, objectPath: IObjectPath) => {
        this.props.addObjectByPath(this.props.currentPage, jsonObject, objectPath)
    }

    deleteSection = (objectPath: IObjectPath) => {
        this.props.deleteObjectByPath(this.props.currentPage, objectPath)
    }

    getPage = (pageName: string) =>
        this.props.manifest.pages.find((page) => pageName.toUpperCase() === page.name.toUpperCase())
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updatePage: (id: number, name: string, path: string) => dispatch(updatePage(id, name, path)),
    updateObjectByPath: (page: IPage, text: string, objectPath: IObjectPath[]) =>
        dispatch(updateObjectByPath(page, text, objectPath)),
    addObjectByPath: (page: IPage, jsonObject: object, objectPath: IObjectPath[]) =>
        dispatch(addObjectByPath(page, jsonObject, objectPath)),
    deleteObjectByPath: (page: IPage, objectPath: any[]) => dispatch(deleteObjectByPath(page, objectPath)),

    movePage: (pageID: number, direction: Direction) => dispatch(movePage(pageID, direction)),
    movePageTo: (fromIndex: number, toIndex: number) => dispatch(movePageTo(fromIndex, toIndex)),
    swapObjectsByPath: (
        fromIndex: number,
        toIndex: number,
        objectPath: IObjectPath,
        pageID: number,
        fromField: string,
        toField: string
    ) => dispatch(swapObjectsByPath(fromIndex, toIndex, objectPath, pageID, fromField, toField)),
    addPage: (pageName: string, pagePath: string) => dispatch(addPage(pageName, pagePath, getPageTemplate(pageName))),
    deletePage: (pageID: number) => dispatch(deletePage(pageID)),
    triggerUndoableStart: () => dispatch(triggerUndoableStart()),
    setCurrentPage: (currentPage: IPage) => dispatch(setCurrentPage(currentPage))
})

export default connect(
    (state: IStore) => ({
        manifest: state.manifest.present.manifest,
        isSaved: state.ui.isSaved,
        isBusy: state.manifest.present.isBusy,
        currentPage: state.ui.currentPage,
        currentPageURL: state.history.URL
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
