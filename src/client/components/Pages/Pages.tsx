import * as React from 'react'
import {RouteComponentProps} from '@reach/router'
import {Direction, DOWN, IManifest, IBackendStatus, UP} from '../../typings'
import './Pages.css'
import {Dispatch} from 'redux'
import {Istore} from '../../redux/store'
import {
    addPageThenDispatch,
    deletePageThenDispatch,
    movePage,
    saveManifestThenDispatch
} from '../../redux/actions/manifest.action'
import {connect} from 'react-redux'
import Loader from '../Loader/Loader'

type Props = RouteComponentProps & {
    manifest: IManifest
    movePage: (pageName: string, direction: Direction) => void
    addPage: (pageName: string,
              pagePath: string,
              repoName: string) => void
    deletePage: (pageName: string,
                 repoName: string) => void
    loadManifest: () => void
    requestStage: IBackendStatus
    saveManifest: (repoName: string, manifest: IManifest ) => void
    isDirty: boolean
    isBusy: false
}

interface State {
    pageName: string
    pagePath: string
}

class Pages extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {pageName: '', pagePath: ''}
    }

    loadPage = (pageName: string) => {
        alert('loading page:' + pageName)
    }

    pageExists = () : boolean => {

        const page = this.props.manifest.pages.find( (page) => this.state.pageName.toUpperCase() === page.name.toUpperCase() )
        return !!page
    }

    // all values filled and the page does not exist
    isFormOk = () =>
          this.state.pageName.trim() !== '' &&
             this.state.pagePath.trim() !== '' &&
             !this.pageExists()

    render = () => {

        const { manifest :{repoName, pages }} = this.props
        const {pageName, pagePath} = this.state

        return (

            <div className="pages_container">
                {this.props.isBusy && <Loader /> }
                <div className="pages">
                    <h2> Pages </h2>
                    {pages.map(
                        (page, key) =>
                            <div className="page-and-button-controls" key={key + page.name}>
                                <div className={'page-button-movers'}>
                                    <button title='Delete Page'
                                        onClick={() => this.props.deletePage(page.name,repoName)}>  &#10016; </button>


                                    {(key > 0) ?
                                        <button title='Move Page Up or more left on the menu'
                                            onClick={() => this.props.movePage(page.name, UP)}>  &#x2B06; </button> :
                                        <div className={'page-button-movers-placeholder'}></div>}
                                    {(key < pages.length - 1) ?
                                        <button title='Move Page Down or  more right on the menu'
                                            onClick={() => this.props.movePage(page.name, DOWN)}> &#x2B07; </button> :
                                        <div className={'page-button-movers-placeholder '}></div>}
                                </div>
                                <div className="page-name" onClick={() => this.loadPage(page.name)}>  {page.name} </div>
                            </div>
                    )}
                </div>
                <div className='add_page'>
                    <h2> New Page </h2>
                    <form onSubmit={() => {
                    }}>
                        <div className='form_element'>
                           <input placeholder='Page Name' type='text' value={pageName}
                                        onChange={(e) =>
                                            this.setState({pageName: e.target.value})}/>
                            {pageName.trim() === '' ? <span className='input-message'>
                                Please enter a  page name for your new page.
                            </span>: <Tick />}
                        </div>

                        <div className='form_element'>

                                <input placeholder='Page Path' type='text' value={pagePath}
                                        onChange={(e) =>
                                            this.setState({pagePath: e.target.value})}/>
                            {pagePath.trim() === '' ?  <span className='input-message'>
                              Please enter a  page path.
                            </span> :  <Tick />}
                        </div>
                        <div className='form-controls'>
                            <input value='Create Page' type='button' disabled={!this.isFormOk()}
                                   onClick={() => this.props.addPage(pageName, pagePath, repoName)}>

                            </input>
                            { this.pageExists() && <div className='input-message'>
                              The page exist
                            </div>}
                            {this.isFormOk() && <Tick />}
                            <div>
                                <input value='Save' type='button' disabled={!this.props.isDirty}
                                       onClick={() => this.props.saveManifest(repoName, this.props.manifest)}>

                                </input>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const Tick = () => <span className='tick'>&#10004;</span>

const mapDispatchToProps = (dispatch: Dispatch) => ({
    movePage: (pageName: string, direction: Direction) =>
        dispatch(movePage(pageName, direction)),
    addPage: (pageName: string, pagePath: string, repoName: string ) =>
        addPageThenDispatch(dispatch, pageName, pagePath, repoName ),
    deletePage: (pageName: string, repoName: string ) =>
        deletePageThenDispatch(dispatch, pageName, repoName ),
    saveManifest: (repoName: string, manifest: IManifest ) =>
        saveManifestThenDispatch(dispatch, repoName, manifest),

})

export default connect(
    (state: Istore) => ({
        manifest: state.manifest.present.manifest,
        isDirty: state.manifest.present.isDirty,
        isBusy: state.manifest.present.isBusy
    }),
    mapDispatchToProps
)(Pages)


