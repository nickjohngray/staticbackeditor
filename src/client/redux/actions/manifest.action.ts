import {createAction} from 'redux-actions'
import {Direction, IManifest, IAction, ApiMethods, IPage} from '../../typings'

export enum ManifestActions {
    MovePage = 'CHANGE/PAGE/POSITION',
    AddPage = 'ADD/PAGE',
    DeletePage = 'DELETE/PAGE',
    UpdatePage = 'UPDATE/PAGE',
    UpdateTextByObjectPath = 'UPDATE/TEXT/BY/OBJECT/PATH',
    Login = 'Login',
    SaveManifest = 'SAVE/MANIFEST',
    loadManifest = 'LOAD/MANIFEST',
    SetAnyTopLevelProperty = 'SET/ANY/TOP/LEVEL/PROPERTY',
    SetAnyTopLevelPropertyUndoable = 'SET/ANY/TOP/LEVEL/PROPERTY/UNDOABLE',
    TriggerUndoableStart = 'TRIGGER/UNDOABLE/START'
}

enum ApiRoutes {
    Save = '/api/save-manifest',
    load = '/api/manifest',
    login = '/api/login'
}

export const setAnyTopLevelProperty = createAction(ManifestActions.SetAnyTopLevelProperty, (object) => object)
export const setAnyTopLevelPropertyUndoable = createAction(
    ManifestActions.SetAnyTopLevelPropertyUndoable,
    (object) => object
)

export const movePage = createAction(ManifestActions.MovePage, (pageName: string, direction: Direction) => ({
    pageName,
    direction
}))

export const addPage = createAction(
    ManifestActions.AddPage,
    (pageName: string, pagePath: string, pageContent: string) => ({pageName, pagePath, pageContent})
)

export const updatePage = createAction(ManifestActions.UpdatePage, (page: IPage, originalPageName: string) => ({
    page,
    originalPageName
}))

export const updateTextByObjectPath = createAction(
    ManifestActions.UpdateTextByObjectPath,
    (page: IPage, text: string, objectPath: any[]) => ({
        page,
        text,
        objectPath
    })
)

export const deletePage = createAction(ManifestActions.DeletePage, (pageName: string) => ({pageName}))

export const triggerUndoableStart = createAction(ManifestActions.TriggerUndoableStart, () => ({}))

export const saveManifest = (manifest: IManifest): IAction => ({
    type: ManifestActions.SaveManifest,
    payload: {manifest},
    api: ApiRoutes.Save,
    method: ApiMethods.post
})

export const loadManifest = (): IAction => ({
    type: ManifestActions.loadManifest,
    api: ApiRoutes.load,
    method: ApiMethods.get
})

export const login = (email: string, pwd: string): IAction => ({
    type: ManifestActions.Login,
    api: ApiRoutes.login,
    method: ApiMethods.post,
    payload: {email, pwd}
})

export type IMovePage = ReturnType<typeof movePage>
export type IAddPage = ReturnType<typeof addPage>
export type IDeletePage = ReturnType<typeof deletePage>
export type IUpdatePage = ReturnType<typeof updatePage>
export type IUpdateTextByObjectPath = ReturnType<typeof updateTextByObjectPath>
export type ISetAnyTopLevelPropertyUndoable = ReturnType<typeof setAnyTopLevelPropertyUndoable>
export type ISetAnyTopLevelProperty = ReturnType<typeof setAnyTopLevelProperty>

export default ManifestActions
