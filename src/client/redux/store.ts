import {createStore, applyMiddleware} from 'redux'
import reducer from './reducers'
import actionMiddleware from './actionMiddleware'
import {APICallStatus} from '../../shared/typings'
import {Constants, getJsonFromLocalStorage} from '../util'

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

const defaultUIState = {
    error: false,
    currentPage: null,
    isSaved: true
}

const uiState = getJsonFromLocalStorage(Constants.ui) || defaultUIState
const manifestStateHistory = getJsonFromLocalStorage(Constants.manifest) || defaultManifestState

const state = {
    ui: uiState,
    history: {URL: '/'},
    manifest: manifestStateHistory
}

const store = createStore(reducer, state, applyMiddleware(actionMiddleware))

export default store

export type IStore = ReturnType<typeof reducer>
