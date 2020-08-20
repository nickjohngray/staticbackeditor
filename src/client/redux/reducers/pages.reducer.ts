import produce from 'immer'
import {handleActions} from 'redux-actions'
import {IPage} from '../../typings'
import {ISetCurrentPage, PagesActions} from '../actions/pages.actions'

interface IPages {
    error: any
    currentPage: IPage
}

const initialState: IPages = {
    error: false,
    currentPage: null
}

const pagesReducer = handleActions<IPages, any>(
    {
        [PagesActions.SetCurrentPage]: produce((draft: IPages, action: ISetCurrentPage) => {
            draft.currentPage = action.payload.page
        })
    },
    initialState
)

export default pagesReducer
