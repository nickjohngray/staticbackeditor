import {globalHistory, HistoryListenerParameter, Router, Link} from '@reach/router';
import React, {FC} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {changeURL} from '../../redux/actions/history.action';
import {IHistory , IState} from '../../typings';
import {ContentToggler} from '@nickjohngray/blockout';
import Pages from "../Pages/Pages";
import {Home} from "../Home";
import './Layout.css'
import {Products} from "../Products";
import {ErrorPage} from "../ErrorPage";
import {NotFound} from "../NotFound";

interface Props {
    changeURL: (url: IHistory) => void;
    currentPageURL: string;
}

interface State {
    links: link[]
}

interface link {
    name: string,
    path: string
}

class Layout extends React.Component<Props, State>  {
    constructor(props) {
        super(props);


        this.props.changeURL({URL: globalHistory.location.pathname});

        this.state = {
             links : [
                { "name": "home", "path": "/"},
                { "name": "error", "path": "404"},
                { "name": "pages", "path": "pages" },
                { "name": "products", "path": "products"}
            ]
        }
    }

    componentDidMount = () =>
    {

        globalHistory.listen((history: HistoryListenerParameter) => {
            this.props.changeURL({URL: history.location.pathname});
        });
    }
    getActiveLinkClassName = (path: string) =>
        this.fixPathForHome(path)  === this.props.currentPageURL ? 'link-active' : null

    fixPathForHome = (path: string) =>
        path === '/' ? path : '/' +  path

    render = () =>
        <div id="content">
            <header>
                <nav>
                    {this.state.links.map( (link) =>
                        <Link className={this.getActiveLinkClassName(link.path) } to={link.path}>{link.name}</Link>
                     )}
                </nav>
            </header>
            <div className="mainMontent">
                <Router>
                        <Home path="/" />
                        <Pages path="pages"/>
                        <ErrorPage path="error"/>
                        <Products path="products"/>
                        <NotFound default />
                </Router>
            </div>
            <footer>
                <ContentToggler className="privacy_policy" title="Help?">
                    <p>Help Here</p>
                </ContentToggler>
            </footer>
        </div>

};



const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeURL: (url: IHistory) => {
        dispatch(changeURL(url));
    },
});

export default connect(
    (state: any) => ({
        currentPageURL: state.history.URL,
    }),
    mapDispatchToProps
)(Layout);


