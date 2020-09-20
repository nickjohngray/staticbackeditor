import {navigate} from '@reach/router'
import produce from 'immer'
import {handleActions} from 'redux-actions'
import {APICallStatus, IManifestAction, IPage} from '../../../shared/typings'
import {Constants, saveStateToLocalStorage} from '../../util'
import ManifestActions from '../actions/manifest.action'
import {IPreview, ISetCurrentPage, ISetIsSaved, UiActions} from '../actions/ui.actions'
import {cloneDeep} from 'lodash'

interface IUI {
    error: any
    currentPage: IPage
    isSaved: boolean
    isDebug
    previewPort: number
    isBusy: boolean
    requestStage: APICallStatus,
}

const initialState: IUI = {
    error: false,
    currentPage: null,
    isSaved: true,
    isDebug: true,
    previewPort: undefined,
    requestStage: APICallStatus.NOT_INIT,
    isBusy: false

}

const uiReducer = handleActions<IUI, any>(
    {
        [UiActions.SetCurrentPage]: produce((draft: IUI, action: ISetCurrentPage) => {
            const d = cloneDeep(draft)
            d.currentPage = action.payload.page
            if(d.currentPage) {
                const p = d.currentPage.path
                navigate('/' + p)
            }
            return d

        }),
        [UiActions.SetIsSaved]: produce((draft: IUI, action: ISetIsSaved) => {
            draft.isSaved = action.payload.isSaved
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
