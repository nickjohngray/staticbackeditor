import {globalHistory, HistoryListenerParameter, Router, navigate, LocationProps} from '@reach/router'
import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {undo} from '../../../../server/routes/undo'
import {changeURL} from '../../../redux/actions/history.action'
import {IHistory, IManifest, IPage} from '../../../../shared/typings'
import {preview} from '../../../redux/actions/ui.actions'
import PageEditor from '../../editors/PageEditor/PageEditor'
import PagesDashboard from '../../editors/PagesDashboard/PagesDashboard'
import './Layout.css'
import {GoLiveIcon, LogoutIcon, PreviewIcon, RedoIcon, SaveIcon, UndoIcon, ViewLiveIcon} from '../../generic/icons'
import {ErrorPage} from '../ErrorPage'
import Loader from '../Loaders/OrbLoader/OrbLoader'
import {NotFound} from '../NotFound'
import {IStore} from '../../../redux/store'
import Login from '../Login/Login'
import {publish, saveManifest, setAnyTopLevelProperty} from '../../../redux/actions/manifest.action'
import {ActionCreators as UndoActionCreators} from 'redux-undo'
import ContentToggler from '../../generic/ContentToggler/ContentToggler'
import {Constants, deleteFromLocalStorage} from '../../../util'

interface IProps {
    location: LocationProps
    changeURL: (url: IHistory) => void
    currentPageURL: string
    manifest: IManifest
    error: {}
    setProp: ({}) => void
    isUndoable: boolean
    isRedoable: boolean
    undo: () => void
    redo: () => void
    isSaved: boolean
    saveManifest: (manifest: IManifest) => void
    publish: (manifest: IManifest) => void
    preview: (manifest: IManifest) => void
    currentPage: IPage
    isDebug: boolean
    isBusy: boolean,
    previewPort: number
    redoableCount: number,
    undoableCount: number,

}

interface IState {
    links: ILink[]
}

interface ILink {
    name: string
    path: string
}

class Layout extends React.Component<IProps, IState> {
    windowObjectReference = null

    constructor(props) {
        super(props)
        // todo these dont need to be in state
        // they are not going to change
        this.state = {
            links: [
                {name: 'home', path: '/'},
                {name: 'error', path: '404'},
                {name: 'pages', path: 'pages'},
                {name: 'products', path: 'products'}
            ]
        }
    }

    openAppPreview = (portNumber: number = undefined) => {
        if (!portNumber) {
            if (!this.props.previewPort) {
                this.props.preview(this.props.manifest)
                return
            }
        }

        const isDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        // todo this port must
        const port = portNumber || this.props.previewPort //  isDev ? 3001 : 300
        // window.open (window.location.hostname + ':3001')
        const width = screen.availWidth
        const height = screen.availHeight

        // if (!this.windowObjectReference || this.windowObjectReference.closed) {
        let url = window.location.protocol + '//' + window.location.hostname + ':' + port

        if (this.props.currentPage) {
            // add a / after current page to pop window with current page if there is one
            url += '/' +  this.props.currentPage.path
        }

        this.windowObjectReference = window.open(url,
            this.props.manifest.appName,
            'resizable,width=' + width + 'height=' + height
        )
        // this.windowObjectReference.location.reload()
        this.windowObjectReference.onClose = () => {
            this.windowObjectReference = null
        }
        // return
        // }
        // window is still open , replace the current page with the new page if one
        /*if(currentPage) {
            // http://localhost:3001/merchandise
            let windowHref = this.windowObjectReference.location.href
            // http://localhost:3001
            windowHref =  windowHref.substring(0,windowHref.lastIndexOf('/') )
            // http://localhost:3001/[ABOUT]
            windowHref = windowHref + currentPage
            // http://localhost:3001/[ABOUT]
            this.windowObjectReference.href = windowHref
        }*/

        this.windowObjectReference.focus()
    }

    componentDidMount = () => {
        // todo get rid of this shit
        globalHistory.listen((history: HistoryListenerParameter) => {
            if (this.props.currentPageURL !== history.location.pathname) {
                this.props.changeURL({URL: history.location.pathname})
            }
        })

        /* todo do we need this as route pages is gone for now*/
        if (!this.props.currentPage && window.location.pathname.indexOf('/pages/edit') !== -1) {
            navigate('/pages', {replace: true})
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (nextProps.previewPort !== this.props.previewPort) {
            this.openAppPreview(nextProps.previewPort)
        }
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.props.error && this.props.error !== prevProps.error) {
            alert(this.props.error)
            this.props.setProp({isBusy: false, error: null})
        }
    }

    getActiveLinkClassName = (path: string) =>
        this.fixPathForHome(path) === this.props.currentPageURL ? 'link-active' : null

    fixPathForHome = (path: string) => (path === '/' ? path : '/' + path)

    render = () => {
        if (!this.props.manifest) {
            return <Login/>
        }

        return (
            <div>
                {this.props.isBusy && <Loader/>}
                <header>
                    <div className="undo_redo_save_container">
                        <button title="Preview" onClick={() => this.openAppPreview()}><PreviewIcon/></button>
                        <button title="Save"
                            /*  to do control below when app knows if its dirty or not*/
                            /* disabled={this.props.isSaved}*/
                                onClick={() => this.props.saveManifest(this.props.manifest)}>
                            <SaveIcon/>

                        </button>
                        <button title="Undo" disabled={!this.props.isUndoable} onClick={() => this.props.undo()}>
                            <UndoIcon/> {this.props.undoableCount > 0 ? [[this.props.undoableCount]] : undefined}
                        </button>
                        <button title="Redo" disabled={!this.props.isRedoable} onClick={() => this.props.redo()}>
                            <RedoIcon/> {this.props.redoableCount > 0 ?
                            [this.props.redoableCount] : undefined}
                        </button>
                        <button title="Go Live" onClick={() => this.props.publish(this.props.manifest)}>
                            <GoLiveIcon/></button>
                        <button title={'View Your Live Website[ ' + this.props.manifest.prodUrl + ']'}
                                onClick={() => {
                                    window.open(this.props.manifest.prodUrl)
                                }}>
                            <ViewLiveIcon/>
                        </button>
                        <button title="Logout"
                                onClick={() => {
                                    deleteFromLocalStorage(Constants.manifest)
                                    deleteFromLocalStorage(Constants.ui)
                                    window.location.href = '/'
                                }}>
                            <LogoutIcon/>
                        </button>
                    </div>
                    {/*  add this back when more menu items are  needed*/}
                    {/* <nav>
                        {this.state.links.map((link, key) => (
                            <Link key={key} className={this.getActiveLinkClassName(link.path)} to={link.path}>
                                {link.name}
                            </Link>
                        ))}
                    </nav>*/}
                    <span className="app_name"> {this.props.manifest.appName.toUpperCase()} </span>
                </header>

                <div className="main-content">
                    <Router>
                        <PagesDashboard path="*"/>
                        <ErrorPage path="error"/>
                        <NotFound default/>
                        {/* when adding more pages add these back maybe have pages on own page*/}
                        {/*<Home path="/" />

                            <ErrorPage path="error" />
                            <Products path="products" />
                            <NotFound default />*/}
                    </Router>
                </div>
                <footer>
                    <ContentToggler className="help_toggler" title="Help?">
                        <p>If you make a mistake just undo it, more help coming soon...</p>
                    </ContentToggler>
                </footer>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeURL: (url: IHistory) => {
        dispatch(changeURL(url))
    },
    setProp: (object) => {
        dispatch(setAnyTopLevelProperty(object))
    },
    undo: () => dispatch(UndoActionCreators.undo()),
    redo: () => dispatch(UndoActionCreators.redo()),
    saveManifest: (manifest: IManifest) => dispatch(saveManifest(manifest)),
    publish: (manifest: IManifest) => dispatch(publish(manifest)),
    preview: (manifest: IManifest) => dispatch(preview(manifest))
})

export default connect(
    (state: IStore) => ({
        currentPageURL: state.history.URL,
        manifest: state.manifest.present.manifest,
        undoableCount: state.manifest.past.length,
        isUndoable: state.manifest.past.length > 0,
        isRedoable: state.manifest.future.length > 0,
        redoableCount: state.manifest.future.length,
        error: state.manifest.present.error,
        isSaved: state.ui.isSaved,
        currentPage: state.ui.currentPage,
        isDebug: state.ui.isDebug,
        isBusy: state.manifest.present.isBusy || state.ui.isBusy,
        previewPort: state.ui.previewPort

    }),
    mapDispatchToProps
)(Layout)
