import {createAction} from 'redux-actions'
import {IPage} from '../../typings'

export enum PagesActions {
    SetCurrentPage = 'SET/CURRENT/PAGE'
}

export const setCurrentPage = createAction(PagesActions.SetCurrentPage, (page: IPage) => ({page}))

export type ISetCurrentPage = ReturnType<typeof setCurrentPage>
