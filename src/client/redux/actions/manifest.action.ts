import {createAction} from 'redux-actions'
import {
    Direction,
    IManifest,
    IManifestAction,
    ApiMethods,
    IPage,
    IObjectPath,
    APICallStatus
} from '../../../shared/typings'

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
    UpdateTextByObjectPath = 'UPDATE/TEXT/BY/OBJECT/PATH',
    AddJsonObjectByObjectPath = 'ADD/JSON/OBJECT/BY/OBJECT/PATH',
    MovePageTo = 'MOVE/PAGE/TO',
    swapObjectsByPath = 'SWAP/OBJECTS/By/PATH'
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

export const movePageTo = createAction(ManifestActions.MovePageTo, (fromIndex: number, toIndex: number) => ({
    fromIndex,
    toIndex
}))

export const swapObjectsByPath = (
    fromIndex: number,
    toIndex: number,
    objectPath: IObjectPath,
    pageID: number,
    fromField?: string,
    toField?: string
): ISwapObjectsByPath => ({
    type: ManifestActions.swapObjectsByPath,
    payload: {fromIndex, toIndex, fromField, toField, objectPath, pageID}
})

export interface ISwapObjectsByPath {
    type: ManifestActions.swapObjectsByPath
    payload: {
        fromIndex: number
        toIndex: number
        objectPath: IObjectPath
        pageID: number
        fromField?: string
        toField?: string
    }
}

/*
export const swapObjectsByPath = createAction(
    ManifestActions.swapObjectsByPath,
    (
        fromIndex: number,
        toIndex: number,
        fromField: string,
        toField: string,
        objectPath: IObjectPath,
        pageID: number
    ) => ({
        fromIndex,
        toIndex,
        fromField,
        toField,
        pageID
    })
)*/

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

export const addObjectByPath = createAction(
    ManifestActions.AddJsonObjectByObjectPath,
    (page: IPage, jsonObject: object, objectPath: any[]) => ({
        page,
        jsonObject,
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
export type IMovePageTo = ReturnType<typeof movePageTo>
export type IAddPage = ReturnType<typeof addPage>
export type IDeletePage = ReturnType<typeof deletePage>
export type IUpdatePage = ReturnType<typeof updatePage>
export type IUpdateTextByObjectPath = ReturnType<typeof updateObjectByPath>
export type ISetAnyTopLevelPropertyUndoable = ReturnType<typeof setAnyTopLevelPropertyUndoable>
export type ISetAnyTopLevelProperty = ReturnType<typeof setAnyTopLevelProperty>
export type IDeleteTextByObjectPath = ReturnType<typeof deleteObjectByPath>
export type IAddObjectByPath = ReturnType<typeof addObjectByPath>

export default ManifestActions
