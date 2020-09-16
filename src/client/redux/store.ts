import {createStore, applyMiddleware} from 'redux'
import reducer from './reducers'
import actionMiddleware from './actionMiddleware'
import {APICallStatus} from '../../shared/typings'
import {Constants, getJsonFromLocalStorage} from '../util'
import {composeWithDevTools} from 'redux-devtools-extension'
import {is} from 'immer/dist/utils/common'

const isDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

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

const store = createStore(
    reducer,
    state,
    isDev ? composeWithDevTools(applyMiddleware(actionMiddleware)) : applyMiddleware(actionMiddleware)
)

export default store

export type IStore = ReturnType<typeof reducer>
