import {combineReducers} from 'redux'
import history from './history.reducer'
import manifest from './manifest.reducer'
import ui from './ui.reducer'
import {Constants} from '../../util'
// import {addPage} from "../actions/manifest.action"

export default combineReducers({
    history, // i think we can kill this maybe..
    [Constants.manifest]: manifest,
    [Constants.ui]: ui
})
