import {createAction} from 'redux-actions'
import {Direction, IManifest, IManifestAction, ApiMethods, IPage} from '../../../shared/typings'

export enum ManifestActionsActionsThatMakeUIDirty {
    MovePage = 'CHANGE/PAGE/POSITION',
    AddPage = 'ADD/PAGE',
    DeletePage = 'DELETE/PAGE',
    UpdatePage = 'UPDATE/PAGE',
    UpdateTextByObjectPath = 'UPDATE/TEXT/BY/OBJECT/PATH',
    DeleteObjectByObjectPath = 'DELETE/OBJECT/BY/OBJECT/PATH'
}

export enum ManifestActions {
    MovePage = 'CHANGE/PAGE/POSITION',
    AddPage = 'ADD/PAGE',
    DeletePage = 'DELETE/PAGE',
    UpdatePage = 'UPDATE/PAGE',
    Login = 'Login',
    SaveManifest = 'SAVE/MANIFEST',
    loadManifest = 'LOAD/MANIFEST',
    SetAnyTopLevelProperty = 'SET/ANY/TOP/LEVEL/PROPERTY',
    SetAnyTopLevelPropertyUndoable = 'SET/ANY/TOP/LEVEL/PROPERTY/UNDOABLE',
    TriggerUndoableStart = 'TRIGGER/UNDOABLE/START',
    DeleteObjectByObjectPath = 'DELETE/OBJECT/BY/OBJECT/PATH',
    UpdateTextByObjectPath = 'UPDATE/TEXT/BY/OBJECT/PATH'
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

export const movePage = createAction(ManifestActions.MovePage, (pageID: number, direction: Direction) => ({
    pageID,
    direction
}))

export const addPage = createAction(
    ManifestActions.AddPage,
    (pageName: string, pagePath: string, pageContent: string) => ({pageName, pagePath, pageContent})
)

export const updatePage = createAction(ManifestActions.UpdatePage, (id: number, name: string, path: string) => ({
    id,
    name,
    path
}))

export const updateObjectByPath = createAction(
    ManifestActions.UpdateTextByObjectPath,
    (page: IPage, text: string, objectPath: any[]) => ({
        page,
        text,
        objectPath
    })
)

export const deleteObjectByPath = createAction(
    ManifestActions.DeleteObjectByObjectPath,
    (page: IPage, objectPath: any[]) => ({
        page,
        objectPath
    })
)

export const deletePage = createAction(ManifestActions.DeletePage, (pageID: number) => ({pageID}))

export const triggerUndoableStart = createAction(ManifestActions.TriggerUndoableStart, () => ({}))

export const saveManifest = (manifest: IManifest): IManifestAction => ({
    type: ManifestActions.SaveManifest,
    payload: {manifest},
    api: ApiRoutes.Save,
    method: ApiMethods.post
})

export const loadManifest = (): IManifestAction => ({
    type: ManifestActions.loadManifest,
    api: ApiRoutes.load,
    method: ApiMethods.get
})

export const login = (email: string, pwd: string): IManifestAction => ({
    type: ManifestActions.Login,
    api: ApiRoutes.login,
    method: ApiMethods.post,
    payload: {email, pwd}
})

export type IMovePage = ReturnType<typeof movePage>
export type IAddPage = ReturnType<typeof addPage>
export type IDeletePage = ReturnType<typeof deletePage>
export type IUpdatePage = ReturnType<typeof updatePage>
export type IUpdateTextByObjectPath = ReturnType<typeof updateObjectByPath>
export type ISetAnyTopLevelPropertyUndoable = ReturnType<typeof setAnyTopLevelPropertyUndoable>
export type ISetAnyTopLevelProperty = ReturnType<typeof setAnyTopLevelProperty>
export type IDeleteTextByObjectPath = ReturnType<typeof deleteObjectByPath>

export default ManifestActions
