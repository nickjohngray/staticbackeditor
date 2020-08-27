import produce from 'immer'
import {handleActions} from 'redux-actions'
import {APICallStatus, Direction, DOWN, IManifest, IManifestAction, IPage, UP} from '../../../shared/typings'
import ManifestActions, {
    IAddObjectByPath,
    IAddPage,
    IDeletePage,
    IDeleteTextByObjectPath,
    IMovePage,
    IMovePageTo,
    IUpdatePage,
    IUpdateTextByObjectPath
} from '../actions/manifest.action'
import undoable, {includeAction} from 'redux-undo'
import {remove, cloneDeep} from 'lodash'
import {findPageById, getNextPageId} from '../../util'

interface IManifestExtened {
    requestStage: APICallStatus
    manifest: IManifest
    error: any
    isBusy?: boolean
    undoableStart?: boolean
}

const initialState: IManifestExtened = {
    manifest: null,
    requestStage: APICallStatus.NOT_INIT,
    error: null,
    isBusy: false,
    undoableStart: false
}

const manifestReducer = handleActions<IManifestExtened, any>(
    {
        // a hack to set any value
        [ManifestActions.SetAnyTopLevelPropertyUndoable]: produce(
            (draft: IManifestExtened, action: IManifestAction) => {
                setAnyTopLevelProperty(action, draft)
            }
        ),
        [ManifestActions.SetAnyTopLevelProperty]: produce((draft: IManifestExtened, action: IManifestAction) => {
            setAnyTopLevelProperty(action, draft)
        }),

        [ManifestActions.loadManifest]: produce((draft: IManifestExtened, action: IManifestAction) => {
            draft.requestStage = action.status
            if (action.status === APICallStatus.fail) {
                draft.error = action.error
            }
            if (action.status === APICallStatus.success) {
                draft.manifest = action.backendPayload as IManifest
            }
            draft.isBusy = action.status === APICallStatus.request
        }),

        [ManifestActions.Login]: produce((draft: IManifestExtened, action: IManifestAction) => {
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

        [ManifestActions.SaveManifest]: produce((draft: IManifestExtened, action: IManifestAction) => {
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
        }),

        [ManifestActions.AddPage]: produce((draft: IManifestExtened, action: IAddPage) => {
            const page = {
                name: action.payload.pageName,
                path: action.payload.pagePath,
                template: 'src/components/pages/' + action.payload.pagePath,
                templateContent: action.payload.pageContent,
                id: getNextPageId(draft.manifest.pages)
            }
            draft.manifest.pages.push(page)
        }),

        [ManifestActions.AddJsonObjectByObjectPath]: produce((draft: IManifestExtened, action: IAddObjectByPath) => {
            const path = action.payload.objectPath

            const clone = cloneDeep(draft)

            let obj = findSecondLastObjectByPath(
                findPageById(action.payload.page.id, clone.manifest.pages),
                action.payload.objectPath
            )
            const jsonObjectCloned = cloneDeep(action.payload.jsonObject)

            const lastItem = path[path.length - 1]
            if (Array.isArray(obj[lastItem])) {
                obj[lastItem].push(jsonObjectCloned)
            } else {
                Object.assign(obj[lastItem], jsonObjectCloned)
            }
            return clone
        }),

        [ManifestActions.UpdateTextByObjectPath]: produce(
            (draft: IManifestExtened, action: IUpdateTextByObjectPath) => {
                const path = action.payload.objectPath

                let obj = findSecondLastObjectByPath(
                    findPageById(action.payload.page.id, draft.manifest.pages),
                    action.payload.objectPath
                )
                obj[path[path.length - 1]] = action.payload.text
            }
        ),

        [ManifestActions.DeleteObjectByObjectPath]: produce(
            (draft: IManifestExtened, action: IDeleteTextByObjectPath) => {
                const path = action.payload.objectPath
                const obj = findSecondLastObjectByPath(
                    findPageById(action.payload.page.id, draft.manifest.pages),
                    action.payload.objectPath
                )
                // mutate the draft by reference
                const lastPartOfPath = path[path.length - 1]
                delete obj[lastPartOfPath]
                if (Array.isArray(obj)) {
                    // remove nulls in array, that occurs when using delete operator  on array items
                    const obj2ItemsWithNoEmptyShit = obj.filter((x) => x !== undefined)
                    // remove all items
                    while (obj.length !== 0) {
                        obj.pop()
                    }
                    // add the fixed array back
                    obj.unshift(...obj2ItemsWithNoEmptyShit)
                }

                /*  let obj = findObjectByPath(
                    findPageById(action.payload.page.id, draft.manifest.pages),
                    action.payload.objectPath
                )

                delete obj[path[path.length - 1]]*/
            }
        ),

        [ManifestActions.UpdatePage]: produce((draft: IManifestExtened, action: IUpdatePage) => {
            const pageToUpdate = findPageById(action.payload.id, draft.manifest.pages)
            if (!pageToUpdate) {
                const msg = 'error could not find page with id, this should never occur' + action.payload.id
                draft.error = msg
                return
            }
            pageToUpdate.name = action.payload.name
            pageToUpdate.path = action.payload.path
        }),

        [ManifestActions.MovePage]: produce((draft: IManifestExtened, action: IMovePage) => {
            movePage(draft.manifest, action.payload.pageID, action.payload.direction)
        }),

        [ManifestActions.MovePageTo]: produce((draft: IManifestExtened, action: IMovePageTo) => {
            const pages: IPage[] = draft.manifest.pages
            const fromObject = pages[action.payload.fromIndex]
            const toObject = pages[action.payload.toIndex]
            pages[action.payload.fromIndex] = toObject
            pages[action.payload.toIndex] = fromObject
        }),

        [ManifestActions.DeletePage]: produce((draft: IManifestExtened, action: IDeletePage) => {
            const pages = draft.manifest.pages
            const pagesRemove = remove(pages, (p) => {
                return p.id === action.payload.pageID
            })

            if (pagesRemove.length === 0) {
                draft.error = 'Failed to remove page with id ' + action.payload.pageID
            }
        }),

        [ManifestActions.TriggerUndoableStart]: produce((draft: IManifestExtened, action: IManifestAction) => {
            draft.undoableStart = true
        })
    },
    initialState
)

const findPageIndex = (pages: IPage[], pageID: number): number => {
    let pageIndex = -1
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id === pageID) {
            pageIndex = i
            break
        }
    }
    return pageIndex
}

const movePageTo = (manifest: IManifest, fromIndex: number, toIndex: number): IManifest => {
    const pages: IPage[] = manifest.pages
    const direction = fromIndex > toIndex ? UP : DOWN

    if (direction === UP) {
        // at top
        if (toIndex === 0) {
            return manifest
        }
    } else {
        // at bottom
        if (toIndex === pages.length - 1) {
            return manifest
        }
    }

    const dropToPageIndex = direction === UP ? toIndex - 1 : toIndex + 1

    const dropToPage = pages[toIndex]
    // swap objects
    pages[dropToPageIndex] = pages[toIndex] // new page goes to where old page way
    pages[toIndex] = dropToPage
}

const movePage = (manifest: IManifest, pageID: number, direction: Direction): IManifest => {
    const pages: IPage[] = manifest.pages
    let pageIndex = findPageIndex(pages, pageID)

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

    const pageToMove = pages[pageIndexToMove]
    // swap objects
    pages[pageIndexToMove] = pages[pageIndex]
    pages[pageIndex] = pageToMove
}

const setAnyTopLevelProperty = (action: IManifestAction, draft: IManifestExtened) => {
    const keys = Object.keys(action.payload)
    const values = Object.values(action.payload)

    for (let i = 0; i < keys.length; i++) {
        draft[keys[i]] = values[i]
    }
}

const findSecondLastObjectByPath = (page: IPage, path: any[]) => {
    // find the parent object by path and set the value
    // see example-find-object-by-path.html for moore info
    // this path is set on an editable leaf during the tree build process
    let obj = page
    for (let i = 0; i < path.length - 1; i++) {
        const item = path[i]
        // keep going up to the next parent
        obj = obj[item] // this is by reference
    }
    return obj
}

// allow user to undo/redo their changes
export default undoable(manifestReducer, {
    ignoreInitialState: true,
    filter: includeAction([
        ManifestActions.UpdatePage,
        ManifestActions.AddPage,
        ManifestActions.DeletePage,
        ManifestActions.MovePage,
        ManifestActions.MovePageTo,
        ManifestActions.TriggerUndoableStart,
        ManifestActions.UpdateTextByObjectPath,
        ManifestActions.DeleteObjectByObjectPath,
        ManifestActions.AddJsonObjectByObjectPath,
        ManifestActions.SetAnyTopLevelPropertyUndoable
    ])
})
