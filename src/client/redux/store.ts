import {createStore, applyMiddleware} from 'redux'
import reducer from './reducers'
import actionMiddleware from './actionMiddleware'
import {APICallStatus} from '../typings'

// let reduxDevTools = {}

// const isDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

/*
 Load REDUX DEV tools!
 ignore the error , it will occur when window is null while building for Prod
 and we dont care about this as we dont want dev tools loaded on Prod,
 only load redux  dev tools on Dev

 ADD THESE BACK SOON!!!
 */
/*if (isDev) {
    try {
        reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
        // tslint:disable-next-line:no-empty
    } catch {
    }
}*/

const defaultManifestState = {
    past: [],
    present: {
        error: null,
        isBusy: false,
        manifest: null,
        requestStage: APICallStatus.NOT_INIT
    },
    future: []
}

const getJsonFromLocalStored = (key: string) => {
    try {
        const data = JSON.parse(localStorage.getItem(key))
        // ensure the manifest history data was stored correctly
        if (data && data.present && data.future) {
            return data
        }
        return null
    } catch (e) {
        console.error(e)
        return null
    }
}

const manifestStateHistory = getJsonFromLocalStored('manifestStateHistory') || defaultManifestState

const state = {
    ui: {
        error: false,
        currentPage: null,
        isSaved: true
    },
    history: {URL: '/'},
    manifest: manifestStateHistory
}

const store = createStore(reducer, state, applyMiddleware(actionMiddleware))

export default store

export type Istore = ReturnType<typeof reducer>
