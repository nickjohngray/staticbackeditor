import {createAction} from 'redux-actions'
import {Direction, IManifest, IAction, ApiMethods, IPage} from '../../typings'

export enum ManifestActions {
    MOVE_PAGE = 'CHANGE/PAGE/POSITION',
    ADD_PAGE = 'ADD/PAGE',
    DELETE_PAGE = 'DELETE/PAGE',
    UPDATE_PAGE = 'UPDATE/PAGE',
    login = 'login',
    saveManifest = 'SAVE/MANIFEST',
    loadManifest = 'LOAD/MANIFEST',
    SET_PROP = 'SET/PROP'
}

enum ApiRoutes {
    SAVE = '/api/save-manifest',
    load = '/api/manifest',
    login = '/api/login'
}

export const setProp = createAction(ManifestActions.SET_PROP, (object) => object)

export const movePage = createAction(ManifestActions.MOVE_PAGE, (pageName: string, direction: Direction) => ({
    pageName,
    direction
}))

export const addPage = createAction(
    ManifestActions.ADD_PAGE,
    (pageName: string, pagePath: string, pageContent: string) => ({pageName, pagePath, pageContent})
)

export const updatePage = createAction(ManifestActions.UPDATE_PAGE, (page: IPage, originalPageName: string) => ({
    page,
    originalPageName
}))

export const deletePage = createAction(ManifestActions.DELETE_PAGE, (pageName: string) => ({pageName}))

export const saveManifest = (manifest: IManifest): IAction => ({
    type: ManifestActions.saveManifest,
    payload: {manifest},
    api: ApiRoutes.SAVE,
    method: ApiMethods.post
})

export const loadManifest = (): IAction => ({
    type: ManifestActions.loadManifest,
    api: ApiRoutes.load,
    method: ApiMethods.get
})

export const login = (email: string, pwd: string): IAction => ({
    type: ManifestActions.login,
    api: ApiRoutes.login,
    method: ApiMethods.post,
    payload: {email, pwd}
})

export type ILoadManifest = ReturnType<typeof loadManifest>
export type ISaveManifest = ReturnType<typeof saveManifest>
export type ILogin = ReturnType<typeof login>
export type IMovePage = ReturnType<typeof movePage>
export type IAddPage = ReturnType<typeof addPage>
export type IDeletePage = ReturnType<typeof deletePage>
export type ISetProp = ReturnType<typeof setProp>
export type IUpdatePage = ReturnType<typeof updatePage>

export default ManifestActions
