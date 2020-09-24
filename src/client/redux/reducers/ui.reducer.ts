import {navigate} from '@reach/router'
import produce from 'immer'
import {handleActions} from 'redux-actions'
import {APICallStatus, IManifestAction, IPage} from '../../../shared/typings'
import {IClearPreviewPort, IPreview, ISetCurrentPageID, ISetIsSaved, UiActions} from '../actions/ui.actions'
import {cloneDeep} from 'lodash'

interface IUI {
    error: any
    currentPageID: number
    isSaved: boolean
    isDebug
    previewPort: number
    isBusy: boolean
    requestStage: APICallStatus,
}

const initialState: IUI = {
    error: false,
    currentPageID: -1,
    isSaved: true,
    isDebug: true,
    previewPort: undefined,
    requestStage: APICallStatus.NOT_INIT,
    isBusy: false

}

const uiReducer = handleActions<IUI, any>(
    {
        [UiActions.SetCurrentPageID]: produce((draft: IUI, action: ISetCurrentPageID) => {
            const UIDraft = cloneDeep(draft)
            UIDraft.currentPageID = action.payload.pageID
            if(UIDraft.currentPageID) {
                const p = UIDraft.currentPageID
                navigate('/' + p)
            }
            return UIDraft

        }),
        [UiActions.SetIsSaved]: produce((draft: IUI, action: ISetIsSaved) => {
            draft.isSaved = action.payload.isSaved
        }),
        [UiActions.ClearPreviewPort]: produce((draft: IUI, action: IClearPreviewPort) => {
            draft.previewPort = undefined
        }),
        [UiActions.Preview]: produce((draft: IUI, action: IPreview) => {
            draft.requestStage = action.status
            if (action.status === APICallStatus.fail) {
                draft.error = action.error
            }

            if (action.status === APICallStatus.success) {
                if (action.backendPayload.error) {
                    draft.error = action.backendPayload.error
                } else { // 3001[39m
                    const portWithRubbish = action.backendPayload.previewPort
                    const portFixed = portWithRubbish.substring(0, 4)

                    draft.previewPort = parseInt(portFixed, 10)


                }
            }

            draft.isBusy = action.status === APICallStatus.request
        })
    },
    initialState
)

export default uiReducer
