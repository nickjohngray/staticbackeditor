import {createAction} from 'redux-actions'
import {IPage} from '../../typings'

export enum UiActions {
    SetCurrentPage = 'SET/CURRENT/PAGE',
    SetIsSaved = 'SET/IS/SAVED'
}

export const setCurrentPage = createAction(UiActions.SetCurrentPage, (page: IPage) => ({page}))
export const setIsSaved = createAction(UiActions.SetIsSaved, (isSaved: boolean) => ({isSaved}))

export type ISetCurrentPage = ReturnType<typeof setCurrentPage>
export type ISetIsSaved = ReturnType<typeof setIsSaved>
