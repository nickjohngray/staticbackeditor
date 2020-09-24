import {createAction} from 'redux-actions'
import {ApiMethods, IManifest, IManifestAction, IPage} from '../../../shared/typings'
import {ApiRoutes} from './ApiRoutes'
import ManifestActions from './manifest.action'

export enum UiActions {
    SetCurrentPageID = 'SET/CURRENT/PAGE',
    SetIsSaved = 'SET/IS/SAVED',
    Preview = 'PREVIEW',
    ClearPreviewPort = 'Clear/Preview/Port'

}

export const setCurrentPageID = createAction(UiActions.SetCurrentPageID, (pageID: number) => ({pageID}))
export const clearPreviewPort = createAction(UiActions.ClearPreviewPort, () => {
    return {}
})

export const setIsSaved = createAction(UiActions.SetIsSaved, (isSaved: boolean) => ({isSaved}))

export const preview = (manifest: IManifest): IManifestAction => ({
    type: UiActions.Preview,
    payload: {manifest},
    api: ApiRoutes.preview,
    method: ApiMethods.post
})

export type ISetCurrentPageID = ReturnType<typeof setCurrentPageID>
export type ISetIsSaved = ReturnType<typeof setIsSaved>
export type IPreview = ReturnType<typeof preview>
export type IClearPreviewPort = ReturnType<typeof clearPreviewPort>
