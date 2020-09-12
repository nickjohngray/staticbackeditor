import {IStore} from '../redux/store'

export const saveToLocalStorage = (key: string, value: any) => localStorage.setItem(key, value)

// saves part of the state identified with the key to storage
// to the local storage  with the same key and the state converted to string,
// get state is the React get State method
export const saveStateToLocalStorage = (key: string, getState: any) => {
    const state = getState(key)
    saveJsonToLocalStorage(key, state[key])
    // localStorage.setItem('manifestStateHistory', JSON.stringify(manifestStateHistory.manifest))
}

export const saveJsonToLocalStorage = (key: string, json: string) => saveToLocalStorage(key, JSON.stringify(json))

export const getJsonFromLocalStorage = (key: string) => {
    try {
        const data = JSON.parse(localStorage.getItem(key))
        // ensure the manifest history data was stored correctly
        if (data) {
            return data
        }
        return null
    } catch (e) {
        throw e
    }
}

export const deleteFromLocalStorage = (key: string) => {
    localStorage.removeItem(key)
}
