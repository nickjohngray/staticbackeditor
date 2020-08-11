import produce from 'immer'
import {handleActions} from 'redux-actions'
import {Direction, IBackendStatus, IManifest, IPage, UP} from '../../typings'
import ManifestActions, {
    IAddPage,
    IAddPhysicalPage, IDeletePage, IDeletePhysicalPage,
    ILoadManifestFail,
    ILoadManifestRequest,
    ILoadManifestSuccess,
    ILogin,
    IMovePage,
    ISaveManifest, ISetProp
} from '../actions/manifest.action'
import {remove} from 'lodash'

interface IManifestExtened{
    requestStage: IBackendStatus
    manifest: IManifest
    error: any,
    isDirty: boolean,
    isBusy?: boolean,


}
const initialState: IManifestExtened = {
    manifest: null,
    requestStage: IBackendStatus.NOT_INIT,
    error: null,
    isDirty: false,
    isBusy: false,
}


// these reduces could be simplified by adding them to an array

export default handleActions<IManifestExtened, any>(
    {

        // a hack to set any value
        [ManifestActions.SET_PROP]:
            produce((draft: IManifestExtened, action: ISetProp) => {
                const keys = Object.keys(action.payload)
                const values = Object.values(action.payload)

                for(let i=0; i< keys.length; i++ ) {
                    draft[keys[i]] = values[i]
                }
            }),

        [ManifestActions.LOAD_MANIFEST_REQUEST]:
            produce((draft: IManifestExtened, action: ILoadManifestRequest) => {
                draft.requestStage =  IBackendStatus.REQUEST
                    draft.isBusy = true
        }),

        [ManifestActions.LOAD_MANIFEST_SUCCESS]:
            produce((draft: IManifestExtened, action: ILoadManifestSuccess) => {
                draft.manifest =  action.payload.manifest
                draft.requestStage = IBackendStatus.SUCCESS
                draft.isBusy = false
            }),

        [ManifestActions.LOAD_MANIFEST_FAIL]:
            produce((draft: IManifestExtened, action: ILoadManifestFail) => {
                draft.requestStage =  IBackendStatus.FAIL
                draft.error = action.error
                draft.isBusy = false
            }),

        [ManifestActions.ADD_PHYSICAL_PAGE]:
            produce((draft: IManifestExtened, action: IAddPhysicalPage) => {
                draft.requestStage =  action.payload.status
                if(action.payload.status === IBackendStatus.FAIL) {
                    draft.error = action.payload.error
                }
                draft.isBusy = action.payload.status === IBackendStatus.REQUEST
            }),

        //  updates the request stats while the scr/pages/components/page is
        //  being removed from projects cloned git repository
        [ManifestActions.DELETE_PHYSICAL_PAGE]:
            produce((draft: IManifestExtened, action: IDeletePhysicalPage) => {
                draft.requestStage =  action.payload.status
                if(action.payload.status === IBackendStatus.FAIL) {
                    draft.error = action.payload.error
                }
                draft.isBusy = action.payload.status === IBackendStatus.REQUEST
            }),

        [ManifestActions.ADD_PAGE]:
            produce((draft: IManifestExtened, action: IAddPage) => {
                const page = {
                    name:  action.payload.pageName,
                    path:  action.payload.pagePath ,
                    template: 'src/components/pages/' +  action.payload.pagePath
                }
                draft.manifest.pages.push(page)
                draft.isDirty = true
            }),

        [ManifestActions.DELETE_PAGE]:
            produce((draft: IManifestExtened, action: IDeletePage) => {
                const pages = draft.manifest.pages
                const pagesRemove = remove(pages,(p) =>
                    {return p.name.toUpperCase() === action.payload.pageName.toUpperCase()})

                if(pagesRemove.length === 0) {
                    draft.error = 'Failed to remove page ' + action.payload.pageName
                }
                draft.isDirty = false
            }),

        [ManifestActions.SAVE_MANIFEST]:
            produce((draft: IManifestExtened, action: ISaveManifest) => {
                draft.requestStage =  action.payload.status
                if(action.payload.status === IBackendStatus.FAIL) {
                    draft.error = action.payload.error
                }
                draft.isBusy = action.payload.status === IBackendStatus.REQUEST
                draft.isDirty = false
            }),

        [ManifestActions.LOGIN]:
            produce((draft: IManifestExtened, action: ILogin) => {
                draft.requestStage =  action.payload.status
                if(action.payload.status === IBackendStatus.FAIL) {
                    draft.error = action.payload.error
                }
                if(action.payload.status === IBackendStatus.SUCCESS) {
                    draft.manifest = action.payload.outputData as IManifest
                }
                draft.isBusy = action.payload.status === IBackendStatus.REQUEST
            }),



        [ManifestActions.MOVE_PAGE]:
            produce((draft: IManifestExtened, action: IMovePage) => {
                movePage(draft.manifest, action.payload.pageName , action.payload.direction)
                draft.isDirty = true
            }),

    },
    initialState
)

const movePage = (manifest: IManifest,
                  pageName: string,
                  direction: Direction) : IManifest => {

    const pages : IPage[] = manifest.pages
    let pageIndex = -1
    for( let i=0; i< pages.length; i++) {
        if(pages[i].name === pageName ) {
            pageIndex = i
            break
        }
    }
    if(direction === UP) {
        if(pageIndex === 0) {
            return manifest
        } } else {
        if(pageIndex === pages.length -1) {
            return manifest
        }
    }

    const pageIndexToMove = direction === UP  ? pageIndex - 1 : pageIndex + 1

    const pageToMoveUp =  pages[pageIndexToMove]
    // swap objects
    pages[pageIndexToMove] = pages[pageIndex]
    pages[pageIndex] = pageToMoveUp
}
