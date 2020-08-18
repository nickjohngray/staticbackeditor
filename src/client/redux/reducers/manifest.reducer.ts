import produce from 'immer'
import {handleActions} from 'redux-actions'
import {Direction, APICallStatus, IManifest, IPage, UP, IAction} from '../../typings'
import ManifestActions, {IAddPage, IMovePage, IUpdatePage} from '../actions/manifest.action'
import undoable, {includeAction} from 'redux-undo'
import {remove} from 'lodash'

interface IManifestExtened {
    requestStage: APICallStatus
    manifest: IManifest
    error: any
    isSaved: boolean
    isBusy?: boolean
    undoableStart?: boolean
}

const initialState: IManifestExtened = {
    manifest: null,
    requestStage: APICallStatus.NOT_INIT,
    error: null,
    isSaved: false,
    isBusy: false,
    undoableStart: false
}

// these reduces could be simplified by adding them to an array

const manifestReducer = handleActions<IManifestExtened, any>(
    {
        // a hack to set any value
        [ManifestActions.SetAnyTopLevelProperty]: produce((draft: IManifestExtened, action: IAction) => {
            const keys = Object.keys(action.payload)
            const values = Object.values(action.payload)

            for (let i = 0; i < keys.length; i++) {
                draft[keys[i]] = values[i]
            }
        }),

        [ManifestActions.SaveManifest]: produce((draft: IManifestExtened, action: IAction) => {
            draft.requestStage = action.status
            if (action.status === APICallStatus.fail) {
                draft.error = action.error
            }
            draft.isBusy = action.status === APICallStatus.request
            draft.isSaved = false
        }),

        [ManifestActions.loadManifest]: produce((draft: IManifestExtened, action: IAction) => {
            draft.requestStage = action.status
            if (action.status === APICallStatus.fail) {
                draft.error = action.error
            }
            if (action.status === APICallStatus.success) {
                draft.manifest = action.backendPayload as IManifest
            }
            draft.isBusy = action.status === APICallStatus.request
            draft.isSaved = false
        }),

        [ManifestActions.Login]: produce((draft: IManifestExtened, action: IAction) => {
            draft.requestStage = action.status
            if (action.status === APICallStatus.fail) {
                draft.error = action.error
            }
            if (action.status === APICallStatus.success) {
                if (action.backendPayload.error) {
                    draft.error = action.backendPayload.error
                } else {
                    draft.manifest = action.backendPayload
                }
            }
            draft.isBusy = action.status === APICallStatus.request
        }),

        [ManifestActions.SaveManifest]: produce((draft: IManifestExtened, action: IAction) => {
            draft.requestStage = action.status
            if (action.status === APICallStatus.fail) {
                draft.error = action.error
            }

            if (action.status === APICallStatus.success) {
                if (action.backendPayload.error) {
                    draft.error = action.backendPayload.error
                }
            }

            draft.isBusy = action.status === APICallStatus.request
            draft.isSaved = false
        }),

        [ManifestActions.AddPage]: produce((draft: IManifestExtened, action: IAddPage) => {
            const page = {
                name: action.payload.pageName,
                path: action.payload.pagePath,
                template: 'src/components/pages/' + action.payload.pagePath,
                templateContent: action.payload.pageContent
            }
            draft.manifest.pages.push(page)
            draft.isSaved = true
        }),

        [ManifestActions.UpdatePage]: produce((draft: IManifestExtened, action: IUpdatePage) => {
            const updatedPage = action.payload.page
            const pageIndex = findPageIndex(draft.manifest.pages, action.payload.originalPageName)
            draft.manifest.pages[pageIndex] = updatedPage
            draft.isSaved = false
        }),

        [ManifestActions.MovePage]: produce((draft: IManifestExtened, action: IMovePage) => {
            movePage(draft.manifest, action.payload.pageName, action.payload.direction)
            draft.isSaved = true
        }),

        [ManifestActions.DeletePage]: produce((draft: IManifestExtened, action: IAddPage) => {
            const pages = draft.manifest.pages
            const pagesRemove = remove(pages, (p) => {
                return p.name.toUpperCase() === action.payload.pageName.toUpperCase()
            })

            if (pagesRemove.length === 0) {
                draft.error = 'Failed to remove page ' + action.payload.pageName
            }
            draft.isSaved = false
        }),

        [ManifestActions.TriggerUndoableStart]: produce((draft: IManifestExtened, action: IAction) => {
            draft.undoableStart = true
        })
    },
    initialState
)

const findPageIndex = (pages: IPage[], pageName: string): number => {
    let pageIndex = -1
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].name === pageName) {
            pageIndex = i
            break
        }
    }
    return pageIndex
}

const movePage = (manifest: IManifest, pageName: string, direction: Direction): IManifest => {
    const pages: IPage[] = manifest.pages
    let pageIndex = findPageIndex(pages, pageName)

    if (direction === UP) {
        if (pageIndex === 0) {
            return manifest
        }
    } else {
        if (pageIndex === pages.length - 1) {
            return manifest
        }
    }

    const pageIndexToMove = direction === UP ? pageIndex - 1 : pageIndex + 1

    const pageToMoveUp = pages[pageIndexToMove]
    // swap objects
    pages[pageIndexToMove] = pages[pageIndex]
    pages[pageIndex] = pageToMoveUp
}

// allow user to undo/redo their changes
export default undoable(manifestReducer, {
    ignoreInitialState: true,
    filter: includeAction([
        ManifestActions.UpdatePage,
        ManifestActions.AddPage,
        ManifestActions.DeletePage,
        ManifestActions.MovePage,
        ManifestActions.TriggerUndoableStart
    ])
})
