import {createAction} from 'redux-actions'
import {ApiMethods, IManifest, IManifestAction, IPage} from '../../../shared/typings'
import {ApiRoutes} from './ApiRoutes'
import ManifestActions from './manifest.action'

export enum UiActions {
    SetCurrentPage = 'SET/CURRENT/PAGE',
    SetIsSaved = 'SET/IS/SAVED',
    Preview = 'PREVIEW',

}

export const setCurrentPage = createAction(UiActions.SetCurrentPage, (page: IPage) => ({page}))
export const setIsSaved = createAction(UiActions.SetIsSaved, (isSaved: boolean) => ({isSaved}))

export const preview = (manifest: IManifest): IManifestAction => ({
    type: UiActions.Preview,
    payload: {manifest},
    api: ApiRoutes.preview,
    method: ApiMethods.post
})

export type ISetCurrentPage = ReturnType<typeof setCurrentPage>
export type ISetIsSaved = ReturnType<typeof setIsSaved>
export type IPreview= ReturnType<typeof preview>
