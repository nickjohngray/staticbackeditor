import {APICallStatus, ApiMethods, IManifestAction} from '../typings'
import axios from 'axios'
import ManifestActions, {ManifestActionsActionsThatMakeUIDirty} from './actions/manifest.action'
import {setIsSaved} from './actions/ui.actions'

// to get in here the action must have the api value set.
// repoName is not needed as that is defined in the manifest
// nod will extract  that
const actionMiddleware = ({dispatch, getState}) => {
    return (next) => async (action: IManifestAction) => {
        const {type, api = null, payload = {}, method} = action

        if (!api) {
            if (
                Object.values(ManifestActionsActionsThatMakeUIDirty).some(
                    (manifestType) => manifestType === action.type
                )
            ) {
                dispatch(setIsSaved(false))
            }

            if (action.type) return next(action)
        }
        // notice there is no API here as we dont need this action to come back in here
        // in a infinitive  loop, it will be dispatched the normal way
        dispatch(makeAction(payload, type, null, APICallStatus.request, null))

        try {
            const response = method === ApiMethods.post ? await axios.post(api, payload) : await axios.get(api, payload)

            const data = response.data
            dispatch(makeAction(payload, type, data, APICallStatus.success, null))

            if (action.type === ManifestActions.SaveManifest) {
                dispatch(setIsSaved(true))
            }
        } catch (error) {
            dispatch(makeAction(payload, type, null, APICallStatus.fail, error))
        }
    }
}

const makeAction = (payload: {}, type, data, status: APICallStatus, error: string) => {
    const apiActionSuccess: IManifestAction = {
        status,
        payload,
        type,
        backendPayload: data,
        error
    }
    return apiActionSuccess
}

export default actionMiddleware
