import {createStore} from 'redux';
import reducer from './reducers'

let reduxDevTools = {}

const isDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

/*
 Load REDUX DEV tools!
 ignore the error , it will occur when window is null while building for Prod
 and we dont care about this as we dont want dev tools loaded on Prod,
 only load redux  dev tools on Dev
 */
if (isDev) {
    try {
        reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    } catch (e) {}
}

const store = createStore(reducer, reduxDevTools)

export default store

export type Istore = ReturnType<typeof reducer>
