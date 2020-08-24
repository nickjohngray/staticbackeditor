import produce from 'immer'
import {handleActions} from 'redux-actions'
import {IPage} from '../../../shared/typings'
import {ISetCurrentPage, ISetIsSaved, UiActions} from '../actions/ui.actions'

interface IUI {
    error: any
    currentPage: IPage
    isSaved: boolean
    isDebug
}

const initialState: IUI = {
    error: false,
    currentPage: null,
    isSaved: true,
    isDebug: true
}

const uiReducer = handleActions<IUI, any>(
    {
        [UiActions.SetCurrentPage]: produce((draft: IUI, action: ISetCurrentPage) => {
            draft.currentPage = action.payload.page
        }),
        [UiActions.SetIsSaved]: produce((draft: IUI, action: ISetIsSaved) => {
            draft.isSaved = action.payload.isSaved
        })
    },
    initialState
)

export default uiReducer
