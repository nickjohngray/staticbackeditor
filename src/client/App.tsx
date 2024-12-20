import React from 'react'
import {Provider} from 'react-redux'
import store from './redux/store'
import Layout from './components/pages/Layout/Layout'
import './App.css'
import MainContext, {IMainContext} from './context/MainContext'
import webpack from 'webpack'

export default class App extends React.Component<{}, IMainContext> {
    constructor(props) {
        super(props)

        /*  this.state = {isDebug: false, setMainContext: this.setMainContext}*/
        this.state = {isDebug: false}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // todo send these errors to  be saved somewhere
        console.log(error)
        console.log(errorInfo)
    }

    /* setMainContext = (mainContext: IMainContext) => {
        this.setState(mainContext)
    }*/

    render = () => {
        return (
            <Provider store={store}>
                <MainContext.Provider value={this.state}>
                    <div className="App">
                        <Layout />
                    </div>
                </MainContext.Provider>
            </Provider>
        )
    }
}
