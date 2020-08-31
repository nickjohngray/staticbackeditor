import React from 'react'
import {Provider} from 'react-redux'
import store from './redux/store'
import Layout from './components/pages/Layout/Layout'
import './App.css'
import StaticBackEditor from './context/StaticBackEditor'

function App() {
    return (
        <Provider store={store}>
            <StaticBackEditor.Provider value={{isDebug: true}}>
                <div className="App">
                    <Layout />
                </div>
            </StaticBackEditor.Provider>
        </Provider>
    )
}

export default App
