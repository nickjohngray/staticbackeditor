import * as React from 'react'
import {LocationProps, navigate, RouteComponentProps, Router} from '@reach/router'
import {IManifest, IPage, IObjectPath, IMoveNodeOrLeafToMethodWithPageId} from '../../../../shared/typings'
import './PagesDashboard.css'
import {Dispatch} from 'redux'
import {IStore} from '../../../redux/store'
import {
    addPage,
    deletePage,
    deleteObjectByPath,
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

    // the current page needs to be set when the manifest changes
    // as the current page is set in a different reducer
    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {

        // if there is page name in the URL but there is no current page
        // it mens the browser got reloaded ,
        // we can't let the path="/:pageID" PageEditor component load
        // actually it will not currently  load as it checks if there is
        // a current page if not nothing is return ,
        // in this case we just want to load the root page
        if (!this.props.currentPage ) {
            const idx = window.location.href.indexOf('/')
            if(idx !== -1 && window.location.href.substring(idx + 1).length > 0  ) {
                navigate('/')
            }
        }
        if (!this.props.currentPage) {
            return
        }
        if (!isEqual(nextProps.manifest, this.props.manifest)) {
            const page = findPageById(this.props.currentPage.id, nextProps.manifest.pages)
            if (!page) {
                // page got deleted from manifest
                this.props.setCurrentPage(undefined)
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
                        onMovePageTo={this.props.movePageTo}
                    />

                    {this.props.currentPage && (
                        <PageEditor
                            products={this.props.manifest.products}
                            path="/:pageID"
                            onObjectChange={(value: string, objectPath) => this.updateObject(value, objectPath)}
                            onObjectAdd={(jsonObject: object, objectPath) => this.addObject(jsonObject, objectPath)}
                            onObjectDelete={(objectPath) => this.deleteObject(objectPath)}
                            page={this.props.currentPage}
                            onPageNameAndPathChange={this.props.updatePage}
                            // todo refactor below into one , only need one asset dir
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

    updateObject = (value: string, objectPath: IObjectPath) => {
        this.props.updateObjectByPath(this.props.currentPage, value, objectPath)
    }

    addObject = (jsonObject: object, objectPath: IObjectPath) => {
        this.props.addObjectByPath(this.props.currentPage, jsonObject, objectPath)
    }

    deleteObject = (objectPath: IObjectPath) => {
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

    movePageTo: (fromIndex: number, toIndex: number) => dispatch(movePageTo(fromIndex, toIndex)),
    swapObjectsByPath: (
        fromIndex: number,
        toIndex: number,
        objectPath: IObjectPath,
        pageID: number,
        fromField: string,
        toField: string
    ) => dispatch(swapObjectsByPath(fromIndex, toIndex, objectPath, pageID, fromField, toField)),
    addPage: (pageName: string, pagePath: string) =>
        dispatch(
            addPage(pageName, pagePath, getPageTemplateContent(pageName), 'src/components/pages/IncredibleTemplate')
        ),
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

const getPageTemplateContent = (pageName: string) => {
    return `import React from 'react';
import {getPage} from 'components/pages/manifestUtil';
import Incredible from 'components/IncredibileEditor/Incredible';
import {IIncredibleItem, IPage} from '../../typings';

export default () => {
    const page : IPage = getPage('about_new')
    const data : IIncredibleItem =   page.incredibleData

    return (
    <div className={'page center-it '}>
        {<Incredible data={data}    />}

    </div>)
}`
}
