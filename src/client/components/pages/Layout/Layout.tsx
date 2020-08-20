import {globalHistory, HistoryListenerParameter, Router, Link} from '@reach/router'
import React from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {changeURL} from '../../../redux/actions/history.action'
import {IHistory, IManifest} from '../../../typings'
import {ContentToggler} from '@nickjohngray/blockout'
import Pages from '../../editors/Pages/Pages'
import {Home} from '../Home'
import './Layout.css'
import {Products} from '../Products'
import {ErrorPage} from '../ErrorPage'
import {NotFound} from '../NotFound'
import {Istore} from '../../../redux/store'
import Login from '../Login/Login'
import {setAnyTopLevelProperty} from '../../../redux/actions/manifest.action'
import {ActionCreators as UndoActionCreators} from 'redux-undo'

interface IProps {
    changeURL: (url: IHistory) => void
    currentPageURL: string
    manifest: IManifest
    error: {}
    setProp: ({}) => void
    isUndoable: boolean
    isRedoable: boolean
    undo: () => void
    redo: () => void
}

interface IState {
    links: ILink[]
}

interface ILink {
    name: string
    path: string
}

class Layout extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)

        this.props.changeURL({URL: globalHistory.location.pathname})

        this.state = {
            links: [
                {name: 'home', path: '/'},
                {name: 'error', path: '404'},
                {name: 'pages', path: 'pages'},
                {name: 'products', path: 'products'}
            ]
        }
    }

    openAppPreview = () => {
        // window.open (window.location.hostname + ':3001')

        const windowObjectReference = window.open(
            window.location.protocol + '//' + window.location.hostname + ':3001',
            this.props.manifest.appName,
            'resizable,scrollbars,status'
        )
        windowObjectReference.location.reload()
    }

    componentDidMount = () => {
        globalHistory.listen((history: HistoryListenerParameter) => {
            this.props.changeURL({URL: history.location.pathname})
        })
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
            return <Login />
        }
        return (
            <>
                <header>
                    <div className="undo_redo_container">
                        <button disabled={!this.props.isUndoable} onClick={() => this.props.undo()}>
                            Undo
                        </button>
                        <button disabled={!this.props.isRedoable} onClick={() => this.props.redo()}>
                            Redo
                        </button>
                        <button onClick={() => this.openAppPreview()}>Preview</button>
                    </div>
                    <nav>
                        {this.state.links.map((link, key) => (
                            <Link key={key} className={this.getActiveLinkClassName(link.path)} to={link.path}>
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </header>
                <div className="main-content">
                    <Router>
                        <Home path="/" />
                        <Pages path="pages/*" />
                        <ErrorPage path="error" />
                        <Products path="products" />
                        <NotFound default />
                    </Router>
                </div>
                <footer>
                    <ContentToggler className="help_toggler" title="Help?">
                        <p>Help Here</p>
                    </ContentToggler>
                </footer>
            </>
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
    redo: () => dispatch(UndoActionCreators.redo())
})

export default connect(
    (state: Istore) => ({
        currentPageURL: state.history.URL,
        manifest: state.manifest.present.manifest,
        isUndoable: state.manifest.past.length > 0,
        isRedoable: state.manifest.future.length > 0,
        error: state.manifest.present.error
    }),
    mapDispatchToProps
)(Layout)
