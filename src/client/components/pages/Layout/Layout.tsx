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
import store, {IStore} from '../../../redux/store'
import Login from '../Login/Login'
import {isEqual} from 'lodash'
import {
    publish,
    saveManifest,
    setAnyTopLevelProperty,
    triggerUndoableStart
} from '../../../redux/actions/manifest.action'
import {ActionCreators, ActionCreators as UndoActionCreators} from 'redux-undo'
import ContentToggler from '../../generic/ContentToggler/ContentToggler'
import {Constants, deleteFromLocalStorage, findPageById} from '../../../util'

interface IProps {
    location: LocationProps
    changeURL: (url: IHistory) => void
    currentPageIDURL: string
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
    currentPageID: number
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

        if (this.props.currentPageID !== -1) {
            // add a / after current page to pop window with current page if there is one
            url += '/' +  findPageById(this.props.currentPageID, this.props.manifest.pages).path
        }

        this.windowObjectReference = window.open(url,
            this.props.manifest.appName,
            'resizable,width=' + width + 'height=' + height
        )
        // this.windowObjectReference.location.reload()
        this.windowObjectReference.onClose = () => {
            this.windowObjectReference = null
        }

        this.windowObjectReference.focus()
    }

    componentDidMount = () =>
        store.dispatch(ActionCreators.clearHistory())


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
        this.fixPathForHome(path) === this.props.currentPageIDURL ? 'link-active' : null

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
                        <button title="Go Live" onClick={() => {
                            if (confirm('Are you sure you want to go live?')) {
                                this.props.publish(this.props.manifest)
                            }
                        }}

                        >
                            <GoLiveIcon/></button>
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
        currentPageIDURL: state.history.URL,
        isSaved: state.ui.isSaved,
        currentPageID: state.ui.currentPageID,
        isDebug: state.ui.isDebug,

      /*  manifest: state.manifest.manifest,
        undoableCount: 0,
        isUndoable: false,
        isRedoable: false,
        redoableCount:0,
        error: state.manifest.error,
        isBusy: state.manifest.isBusy || state.ui.isBusy,*/

        manifest: state.manifest.present.manifest,
        undoableCount: state.manifest.past.length,
        isUndoable: state.manifest.past.length > 0,
        isRedoable: state.manifest.future.length > 0,
        redoableCount: state.manifest.future.length,
        error: state.manifest.present.error,
        isBusy: state.manifest.present.isBusy || state.ui.isBusy,


        previewPort: state.ui.previewPort

    }),
    mapDispatchToProps
)(Layout)
