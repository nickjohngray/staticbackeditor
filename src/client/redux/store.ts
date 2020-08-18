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

const state = {
    history: {URL: '/'},
    manifest: {
        past: [],
        present: {
            error: null,
            isBusy: false,
            isSaved: false,
            manifest: null,
            requestStage: APICallStatus.NOT_INIT
        },
        future: []
    }
}
/*

const state = {
    history: {URL: '/'},
    manifest: {
        error: null,
        isBusy: false,
        isSaved: false,
        manifest: null,
        requestStage: 'NOT_INIT'
    }
}
*/

const store = createStore(reducer, state, applyMiddleware(actionMiddleware))

export default store

export type Istore = ReturnType<typeof reducer>
