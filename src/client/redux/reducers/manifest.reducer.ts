import produce from 'immer'
import {handleActions} from 'redux-actions'
import {
    APICallStatus,
    IDefaultFieldOrder,
    IManifest,
    IManifestAction,
    IObjectPath,
    IPage,
    IProduct,
    ISection
} from '../../../shared/typings'
import ManifestActions, {
    IAddObjectByPath,
    IAddPage,
    IDeletePage,
    IDeleteTextByObjectPath,
    IMovePageTo,
    ISwapObjectsByPath,
    // ISwapObjectsByPath,
    IUpdatePage,
    IUpdateTextByObjectPath
} from '../actions/manifest.action'
import undoable, {includeAction} from 'redux-undo'
import {cloneDeep, remove} from 'lodash'
import {Constants, findPageById, getNextPageId, PageContentEditors} from '../../util'
import {IIncredibleItem} from '../../components/editors/IncredibileEditor'

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

        [ManifestActions.PublishManifest]: produce((draft: IManifestExtened, action: IManifestAction) => {
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
            const page: IPage = {
                name: action.payload.pageName,
                path: action.payload.pagePath,
                template: action.payload.templatePath,
                templateContent: action.payload.pageContent,
                editor: PageContentEditors.incredibleEditor,
                incredibleData,
                id: getNextPageId(draft.manifest.pages)
            }
            draft.manifest.pages.push(page)
        }),

        // allows any object to be added , like page and product
        [ManifestActions.AddJsonObjectByObjectPath]: produce((draft: IManifestExtened, action: IAddObjectByPath) => {
            const clone = cloneDeep(draft)
            // const clone = draft
            if (action.payload.objectPath[0] !== Constants.products) {
                const path = action.payload.objectPath
                const target: [] | Object = findSecondLastObjectByPath(
                    findPageById(action.payload.page.id, clone.manifest.pages),
                    action.payload.objectPath
                )

                const jsonObjectCloned = cloneDeep(action.payload.jsonObject)

                addItem(path, target, jsonObjectCloned)
                return clone
            }

            // todo improve below code

            // adding new product path like [product]
            if (action.payload.objectPath.length === 1) {
                clone.manifest.products.push(cloneDeep(action.payload.jsonObject) as IProduct)
                return clone
            }
            // adding a property to a product path like [product,0]
            if (action.payload.objectPath.length === 2) {
                Object.assign(
                    clone.manifest.products[action.payload.objectPath[1]],
                    cloneDeep(action.payload.jsonObject)
                )
                // clone.manifest.products[action.payload.objectPath[1]].push(cloneDeep(action.payload.jsonObject) as IProduct)
                return clone
            }
            let pathWithoutProduct = [...action.payload.objectPath]
            pathWithoutProduct.splice(0, 1)
            let target = findSecondLastObjectByPath(clone.manifest.products, pathWithoutProduct)
            addItem(pathWithoutProduct, target, cloneDeep(action.payload.jsonObject))
            return clone
        }),

        // allows any object's text value to be updated
        [ManifestActions.UpdateTextByObjectPath]: produce(
            (draft: IManifestExtened, action: IUpdateTextByObjectPath) => {
                const clone = cloneDeep(draft)
                const path = action.payload.objectPath
                const page: IPage = findPageById(action.payload.page.id, clone.manifest.pages)
                if (action.payload.objectPath[0] !== Constants.products) {
                    const target: [] | Object = findSecondLastObjectByPath(page, action.payload.objectPath)
                    // todo text can be any object
                    if (Array.isArray(action.payload.text) && Array.isArray(target)) {
                        const payloadAsArray: any[] = action.payload.text
                        const secondLastObjectIndex = parseInt(path[path.length - 1], 10)
                        // addItem(path, target, arr)
                        // replace first item

                        const targetAsArray: any[] = target // [secondLastObjectIndex]

                        /* if (payloadAsArray.length === 1) {
                            targetAsArray[secondLastObjectIndex] = cloneDeep(payloadAsArray[0])
                            return clone
                        }*/
                        // target[secondLastObjectIndex] = arr[0]

                        targetAsArray.splice(secondLastObjectIndex, 1, ...payloadAsArray)

                        // insert other new items if any in arr below other items
                        /* for (let i = 1; i < payloadAsArray.length; i++) {

                        }*/

                        return clone
                    }
                    target[path[path.length - 1]] = action.payload.text
                    return clone
                }
                // product update
                let pathWithoutProductKey: IObjectPath = [...action.payload.objectPath]
                pathWithoutProductKey.splice(0, 1)
                const target: [] | Object = findSecondLastObjectByPath(clone.manifest.products, pathWithoutProductKey)
                target[path[path.length - 1]] = action.payload.text
                return clone
            }
        ),

        // allows any object to be deleted like image of a section or a product etc.
        [ManifestActions.DeleteObjectByObjectPath]: produce(
            (draft: IManifestExtened, action: IDeleteTextByObjectPath) => {
                const clone = cloneDeep(draft)
                const path = action.payload.objectPath
                if (action.payload.objectPath[0] !== Constants.products) {
                    const target: [] | Object = findSecondLastObjectByPath(
                        findPageById(action.payload.page.id, clone.manifest.pages),
                        action.payload.objectPath
                    )
                    deleteItem(target, path)
                    return clone
                }
                // product
                let pathWithoutProductKey: IObjectPath = [...action.payload.objectPath]
                pathWithoutProductKey.splice(0, 1)
                const target: [] | Object = findSecondLastObjectByPath(clone.manifest.products, pathWithoutProductKey)
                deleteItem(target, path)
                return clone
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

        [ManifestActions.MovePageTo]: produce((draft: IManifestExtened, action: IMovePageTo) => {
            const pages: IPage[] = draft.manifest.pages
            const fromObject = pages[action.payload.fromIndex]
            const toObject = pages[action.payload.toIndex]
            pages[action.payload.fromIndex] = toObject
            pages[action.payload.toIndex] = fromObject
        }),

        [ManifestActions.swapObjectsByPath]: produce((draft: IManifestExtened, action: ISwapObjectsByPath) => {
            const clone = cloneDeep(draft)
            const page: IPage = findPageById(action.payload.pageID, clone.manifest.pages)

            const maybeArray =
                action.payload.objectPath[0] !== Constants.products
                    ? findObjectByPath(page, action.payload.objectPath)
                    : clone.manifest.products

            if (!maybeArray) {
                throw new Error('could not get target object to update')
            }

            if (Array.isArray(maybeArray)) {
                const fromObject = maybeArray[action.payload.fromIndex]
                const toObject = maybeArray[action.payload.toIndex]
                maybeArray[action.payload.fromIndex] = toObject
                maybeArray[action.payload.toIndex] = fromObject
            } else {
                // plan object like {x:1}
                let fromKey = action.payload.fromField
                let toKey = action.payload.toField
                if (!fromKey || !toKey) {
                    throw new Error(`object is not an array but an object in this case 
                     fromKey[${fromKey}] and toKey[${toKey}] 
                     must be given but they are undefined`)
                }

                const section: ISection = maybeArray

                if (!section.defaultFieldOrder || !Array.isArray(section.defaultFieldOrder)) {
                    throw new Error(
                        'object is a object and defaultFieldOrder key in not in the object, or its not an array, this must be set'
                    )
                }

                const defaultFieldOrderTo = section.defaultFieldOrder.find(
                    (order: IDefaultFieldOrder) => order.name === toKey
                )
                const defaultFieldOrderFrom = section.defaultFieldOrder.find(
                    (order: IDefaultFieldOrder) => order.name === fromKey
                )
                defaultFieldOrderTo.order = action.payload.fromIndex
                defaultFieldOrderFrom.order = action.payload.toIndex
            }

            return clone
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

const setAnyTopLevelProperty = (action: IManifestAction, draft: IManifestExtened) => {
    const keys = Object.keys(action.payload)
    const values = Object.values(action.payload)

    for (let i = 0; i < keys.length; i++) {
        draft[keys[i]] = values[i]
    }
}

const findSecondLastObjectByPath = (objIn: IPage | IProduct[], path: IObjectPath): any => {
    // find the parent object by path and set the value
    // see example-find-object-by-path.html for moore info
    // this path is set on an editable leaf during the tree build process
    let obj = objIn
    for (let i = 0; i < path.length - 1; i++) {
        const item = path[i]
        // keep going up to the next parent
        obj = obj[item] // this is by reference
    }
    return obj
}

const findObjectByPath = (page: IPage, path: any[]): any => {
    let obj = page
    for (let i = 0; i <= path.length - 1; i++) {
        const item = path[i]
        // keep going up to the next parent
        obj = obj[item] // this is by reference
    }
    return obj
}

const deleteItem = (target: [] | Object, path: IObjectPath) => {
    const lastPartOfPath = path[path.length - 1]
    delete target[lastPartOfPath]
    if (Array.isArray(target)) {
        // remove nulls in array, that occurs when using delete operator  on array items
        const obj2ItemsWithNoEmptyShit = target.filter((x) => x !== undefined)
        // remove all items
        while (target.length !== 0) {
            target.pop()
        }
        // add the fixed array back
        target.unshift(...obj2ItemsWithNoEmptyShit)
    }
}

const addItem = (path: IObjectPath, target: [] | Object, jsonObjectCloned: [] | Object) => {
    const lastKey = path.length === 1 ? path[0] : path[path.length - 1]
    if (Array.isArray(target[lastKey])) {
        target[lastKey].push(jsonObjectCloned)
    } else {
        Object.assign(target[lastKey], jsonObjectCloned)
    }
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
        ManifestActions.SetAnyTopLevelPropertyUndoable,
        ManifestActions.swapObjectsByPath
    ])
})

const incredibleData: IIncredibleItem = {
    type: 'row',
    children: [
        {
            type: 'richText',
            children: [
                {
                    type: 'heading-one',
                    children: [
                        {
                            text: 'New Heading'
                        }
                    ]
                },
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Some Text here...'
                        }
                    ]
                }
            ]
        }
    ]
}
