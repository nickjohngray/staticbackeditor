import {createAction} from 'redux-actions'
import {Direction, IBackendStatus, IManifest} from '../../typings'
import axios from 'axios'
import {Dispatch} from 'redux'
import {capitalize} from 'lodash'

export enum ManifestActions {
    MOVE_PAGE = 'CHANGE/PAGE/POSITION',
    ADD_PAGE = 'ADD/PAGE',
    DELETE_PAGE = 'DELETE/PAGE',
    LOAD_MANIFEST_REQUEST = 'LOAD/MANIFEST/REQUEST',
    LOAD_MANIFEST_SUCCESS ='LOAD/MANIFEST/SUCCESS',
    LOAD_MANIFEST_FAIL = 'LOAD/MANIFEST/FAIL',
    ADD_PHYSICAL_PAGE = 'ADD/PHYSICAL/PAGE',
    DELETE_PHYSICAL_PAGE = 'DELETE/PHYSICAL/PAGE',
    LOGIN = 'LOGIN',
    SAVE_MANIFEST = 'SAVE/MANIFEST',
    SET_PROP = 'SET/PROP',
}

export const setProp =
    createAction(ManifestActions.SET_PROP,
        (object) => (object))


export const movePage =
    createAction(ManifestActions.MOVE_PAGE,
        (pageName: string, direction: Direction) => ({ pageName,direction}))


export const addPage =
    createAction(ManifestActions.ADD_PAGE,
        (pageName: string, pagePath: string) => ({ pageName,pagePath}))

export const deletePage =
    createAction(ManifestActions.DELETE_PAGE,
        (pageName: string) => ({ pageName}))

const deletePhysicalPage =
    createAction(ManifestActions.DELETE_PHYSICAL_PAGE,
        (backendJob: IBackendJob)  => (backendJob))

interface IBackendJob {
    status: IBackendStatus,
    error: any,
    api: string,
    inputData: {},
    outputData?: {}
}

export const saveManifestThenDispatch = async (dispatch,
                                          repoName: string, manifest: IManifest
) => {

    const job : IBackendJob = {
        status: IBackendStatus.REQUEST,
        error: null,
        api: '/api/save-manifest',
        inputData: {repoName, manifest}

    }
    dispatch(saveManifest(job)) // request

    try {
        const response = await axios.post(job.api, job.inputData)
        if(response.data.error) {
            job.status = IBackendStatus.FAIL
            job.error = response.data.error
            dispatch(saveManifest(job)) // error
        } else {
            job.status = IBackendStatus.SUCCESS
            await dispatch(saveManifest(job)) // success
        }
    } catch (e) {
        job.status = IBackendStatus.FAIL
        job.error = e
        dispatch(saveManifest(job))
    }
}

export const addPageThenDispatch = async (dispatch: Dispatch,
                                            pageName:string,
                                            pagePath: string,
                                            repoName: string
                                          ) => {

    const job : IBackendJob = {
        status: IBackendStatus.REQUEST,
        error: null,
        api: '/api/add-page',
        inputData: {pageName, pagePath, repoName}

    }
    dispatch(addPhysicalPage(job))

    try {
        const response = await axios.post(job.api, job.inputData)
        if(response.data.error) {
            job.status = IBackendStatus.FAIL
            job.error = response.data.error
            dispatch(addPhysicalPage(job))
        } else {
            job.status = IBackendStatus.SUCCESS
            await dispatch(addPhysicalPage(job))
            const x = await dispatch(addPage(pageName, capitalize( pagePath))) // add page in view\
        }
    } catch (e) {
        job.status = IBackendStatus.FAIL
        job.error = e
        dispatch(addPhysicalPage(job))
    }
}


export const deletePageThenDispatch = async (dispatch: Dispatch,
                                          pageName:string,
                                          repoName: string
) => {

    const job : IBackendJob = {
        status: IBackendStatus.REQUEST,
        error: null,
        api: '/api/delete-page',
        inputData: {pageName, repoName}

    }
    dispatch(deletePhysicalPage(job))

    try {
        const response = await axios.post(job.api, job.inputData)
        if(response.data.error) {
            job.status = IBackendStatus.FAIL
            job.error = response.data.error
            dispatch(deletePhysicalPage(job))
        } else {
            job.status = IBackendStatus.SUCCESS
            await dispatch(deletePhysicalPage(job))
            const x = await dispatch(deletePage(pageName)) // add page in view\
        }
    } catch (e) {
        job.status = IBackendStatus.FAIL
        job.error = e
        dispatch(deletePhysicalPage(job))
    }
}

export const loginThenDispatch = async (dispatch,
                                        email:string,
                                        pwd: string
) => {

    const job : IBackendJob = {
        status: IBackendStatus.REQUEST,
        error: null,
        api: '/api/login',
        inputData: {email, pwd},
        outputData: {}
    }
    dispatch(login(job))

    try {
        const response = await axios.post(job.api, job.inputData)
        // how to check for error here from response
        if(response.data.error) {
            job.status = IBackendStatus.FAIL
            job.error = response.data.error
            dispatch(login(job))
        } else {
            job.status = IBackendStatus.SUCCESS
            job.outputData = response.data
            dispatch(login(job))
        }
    } catch (e) {
        job.status = IBackendStatus.FAIL
        job.error = e
       dispatch(login(job))
    }
}

const login =
    createAction(ManifestActions.LOGIN,
        (backendJob: IBackendJob)  => (backendJob))

// this allows the frontend to know the backend status of the backend job
// why do we even need an action creators why not make plan json object with type and payload ?
// because we can use typeof below to make a type, maybe this is the only advantage

const addPhysicalPage =
    createAction(ManifestActions.ADD_PHYSICAL_PAGE,
        (backendJob: IBackendJob)  => (backendJob))


const saveManifest =
    createAction(ManifestActions.SAVE_MANIFEST,
        (backendJob: IBackendJob)  => (backendJob))

export const loadManifest = async dispatch => {
    dispatch(loadManifestRequest())

    try {
        const response = await axios.get('/api/manifest')
        dispatch(loadManifestSuccess( response.data ))
    } catch (e) {
        dispatch(loadManifestFail(e))
    }
}

// Internal actions load manifest actions called by loadManifest
 const loadManifestRequest =
    createAction(ManifestActions.LOAD_MANIFEST_REQUEST,
        () => {})

 const loadManifestSuccess =
    createAction(ManifestActions.LOAD_MANIFEST_SUCCESS,
        (manifest: IManifest) => ({manifest}))

const loadManifestFail =
    createAction(ManifestActions.LOAD_MANIFEST_FAIL,
        (error: any) => ({error}))


// refactor three below into one job
export type ILoadManifestRequest = ReturnType<typeof loadManifestRequest>
export type ILoadManifestSuccess = ReturnType<typeof loadManifestSuccess>
export type ILoadManifestFail = ReturnType<typeof loadManifestFail>

export type IAddPhysicalPage = ReturnType<typeof addPhysicalPage>
export type IDeletePhysicalPage = ReturnType<typeof deletePhysicalPage>
export type ISaveManifest = ReturnType<typeof saveManifest>
export type ILogin = ReturnType<typeof login>
export type IMovePage = ReturnType<typeof movePage>
export type IAddPage = ReturnType<typeof addPage>
export type IDeletePage = ReturnType<typeof deletePage>
export type ISetProp = ReturnType<typeof setProp>

export default ManifestActions

