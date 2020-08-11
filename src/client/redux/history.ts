import {createHistory, History} from '@reach/router'
// listen to the browser history

//import {HistoryListener, HistoryListenerParameter, Link} from '@reach/router';

const history: History = createHistory(window as any)

export default history
