import produce from 'immer'
import {handleActions} from 'redux-actions'
import {IHistory} from '../../typings'
import HistoryActions, {changeHistoryAction} from '../actions/history.action'

export const initialState = {URL: '/'}

export default handleActions<IHistory, any>(
    {
        [HistoryActions.CHANGE_URL]: produce((draft: IHistory, action: changeHistoryAction) => {
            draft.URL = action.payload.URL
        })
    },
    initialState
)
