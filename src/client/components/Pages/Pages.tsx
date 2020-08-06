import * as React from "react"
import {RouteComponentProps} from "@reach/router"
import axios from 'axios'
import {IManifest} from "../../typings"
import './Pages.css'
import cloneDeep from 'lodash/cloneDeep';

type Props = RouteComponentProps & {

}

interface  State {
    manifest:IManifest
}

class Pages extends  React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = { manifest: null}

    }

    componentDidMount = async () =>  {
        try {

            //const response = await axios.post('/api/save-manifest')
            const response = await axios.get('/api/manifest')
            const manifest = response.data.manifest
            this.setState({manifest})
        }catch (e) {
            alert(e.message)
        }
    }

    loadPage = (pageName: string)=> {
        alert('loading page:' + pageName)
    }

    move = (pageName: string, direction: 'up' | 'down')=> {
        const m  = cloneDeep(this.state.manifest)
        // @ts-ignore
        const pages : IPage[] = m.pages;
        let pageIndex = -1
        for( let i=0; i< pages.length; i++) {
            if(pages[i].name === pageName ) {
                pageIndex = i;
                break;
            }
        }
        if(direction === 'up') {
        if(pageIndex === 0) {
            alert('cant move its already at the top')
            return
        } } else {
            if(pageIndex === pages.length -1) {
                alert('cant move its already at the bottom')
                return
            }
        }


        const pageIndexToMoveUp = direction === 'up' ? pageIndex - 1 : pageIndex + 1

        const pageToMoveUp =  cloneDeep(pages[pageIndexToMoveUp]);
        // swap objects
        pages[pageIndexToMoveUp] = pages[pageIndex]
        pages[pageIndex] = pageToMoveUp

        this.setState({manifest: m})


    }

    moveDown = (pageName: string)=> {
        alert('move down:' + pageName)
    }

    render = ()  => {
        if(!this.state.manifest ) {
            return (<div>Loading...</div>)

        }


        const {manifest} = this.state

        return (
            <div className="pages">
                {manifest.pages.map(
                (page, key) =>
                    <div className="page-and-button-controls" key={key + page.name} >
                        <div className={'page-button-movers'}>
                            { (key > 0) ? <button  onClick={ ()=> this.move(page.name,'up')}>  &#x2B06; </button> : <div className={'page-button-movers-placeholder'}> </div>}
                            { (key <  manifest.pages.length -1)  ? <button  onClick={ ()=> this.move(page.name,'down')}> &#x2B07; </button> : <div className={'page-button-movers-placeholder '}> </div>}
                        </div>
                        <div className="page-name" onClick={ ()=>  this.loadPage(page.name)  }>  {page.name} </div>
                    </div>
                 )}
            </div>
       )
    }
}


export default  Pages
