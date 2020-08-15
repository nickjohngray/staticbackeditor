import {globalHistory, HistoryListenerParameter, Router, Link} from '@reach/router'
import React, {FC} from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {changeURL} from '../../redux/actions/history.action'
import {IHistory, IManifest, IState} from '../../typings'
import {ContentToggler} from '@nickjohngray/blockout'
import Pages from '../Pages/Pages'
import {Home} from '../Home'
import './Layout.css'
import {Products} from '../Products'
import {ErrorPage} from '../ErrorPage'
import {NotFound} from '../NotFound'
import {Istore} from '../../redux/store'
import Login from "../Login/login";
import {setProp} from '../../redux/actions/manifest.action'
import { ActionCreators as UndoActionCreators } from 'redux-undo'

interface Props {
    changeURL: (url: IHistory) => void
    currentPageURL: string
    manifest: IManifest
    error: {},
    setProp: ({}) => void
    isUndoable:boolean
    isRedoable: boolean,
    undo: () => void
    redo: () => void,

}

interface State {
    links: link[]
}

interface link {
    name: string,
    path: string
}

class Layout extends React.Component<Props, State> {
    constructor(props) {
        super(props)

        this.props.changeURL({URL: globalHistory.location.pathname})

        this.state = {
            links: [
                {"name": "home", "path": "/"},
                {"name": "error", "path": "404"},
                {"name": "pages", "path": "pages"},
                {"name": "products", "path": "products"}
            ]
        }
    }

    openAppPreview = () => {
       // window.open (window.location.hostname + ':3001')

        const windowObjectReference = window.open(
            window.location.protocol + '//' + window.location.hostname +':3001',
            this.props.manifest.appName,
            "resizable,scrollbars,status"


        );
        windowObjectReference. location.reload()
    }

     openRequestedPopup = () => {
        const windowObjectReference = window.open(
            "http://www.gmail.com",
            "DescriptiveWindowName",
            "resizable,scrollbars,status"
        );
    }

    componentDidMount = () => {

        globalHistory.listen((history: HistoryListenerParameter) => {
            this.props.changeURL({URL: history.location.pathname})
        })
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if(this.props.error && this.props.error !== prevProps.error) {
            alert(this.props.error)
            this.props.setProp({isBusy:false,error:null} )

        }
    }

    getActiveLinkClassName = (path: string) =>
        this.fixPathForHome(path) === this.props.currentPageURL ? 'link-active' : null

    fixPathForHome = (path: string) =>
        path === '/' ? path : '/' + path

    render = () => {

        if (!this.props.manifest) {
            return (<Login/>)
        }
        return (
            <>
                <header>
                    <nav>
                        {this.state.links.map((link) =>
                            <Link className={this.getActiveLinkClassName(link.path)} to={link.path}>{link.name}</Link>
                        )}
                    </nav>
                </header>
                <div className="mainMontent">
                    <div>
                        <button disabled={!this.props.isUndoable}
                                onClick={() => this.props.undo() }>Undo</button>
                        <button disabled={!this.props.isRedoable}
                                onClick={() => this.props.redo() }>Redo</button>
                        <button
                                onClick={() => this.openAppPreview() }>Preview</button>

                    </div>
                    <Router>
                        <Home path="/"/>
                        <Pages path="pages"/>
                        <ErrorPage path="error"/>
                        <Products path="products"/>
                        <NotFound default/>
                    </Router>
                </div>
                <footer>
                    <ContentToggler className="help_toggler" title="Help?">
                        <p>Help Here</p>
                    </ContentToggler>
                </footer>
            </>)
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeURL: (url: IHistory) => {
        dispatch(changeURL(url))
    },
    setProp: (object) => {
        dispatch(setProp(object))
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


