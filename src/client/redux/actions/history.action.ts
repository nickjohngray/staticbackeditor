import {createAction} from 'redux-actions'
import {IHistory} from '../../typings'

export enum HistoryActions {
    CHANGE_URL = 'HISTORY/CHANGE_URL',
}

export const changeURL =
    createAction(HistoryActions.CHANGE_URL, (history: IHistory) => history)

export type changeHistoryAction = ReturnType<typeof changeURL>

export default HistoryActions
