import {combineReducers} from 'redux'
import history from './history.reducer'
import manifest from './manifest.reducer'
import pages from './pages.reducer'
// import {addPage} from "../actions/manifest.action"

export default combineReducers({
    history,
    manifest,
    pages
})
