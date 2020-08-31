import {IDefaultFieldOrder, IObjectPath} from '../../../../shared/typings'

import {cloneDeep, isEqual} from 'lodash'
import {Constants} from '../../../util'
import {IAddablePathConfig} from './Tree'

// todo write test for this
export const getConfigForPath = (
    currentPath: IObjectPath,
    configs: IAddablePathConfig[]
): IAddablePathConfig | null => {
    if (configs === undefined) {
        return null
    }

    for (let i = 0; i < configs.length; i++) {
        let userPath = cloneDeep(configs[i].path)
        // replace * in user path with actual value from path
        if (userPath.length === currentPath.length) {
            for (let j = 0; j < configs.length; j++) {
                if (userPath[j] === Constants.wildcard) {
                    userPath[j] = currentPath[j]
                }
            }
        }
        if (isEqual(currentPath, userPath)) {
            return configs[i]
        }
    }

    return null
}

export const doesPathMatch = (currentPath: IObjectPath[], configPath: IObjectPath): boolean => {
    if (currentPath === undefined || configPath === undefined) {
        return false
    }

    for (let i = 0; i < configPath.length; i++) {
        // replace * in user path with actual value from path
        const pathWithWildcardsReplaced = cloneDeep(configPath)
        if (configPath.length === currentPath.length) {
            for (let j = 0; j < configPath.length; j++) {
                if (configPath[i][j] === Constants.wildcard) {
                    pathWithWildcardsReplaced[i][j] = currentPath[j]
                }
            }
        }
        if (isEqual(currentPath, pathWithWildcardsReplaced[i])) {
            return true
        }
    }

    return null
}

export const isOk = (currentPath: IObjectPath, childrenCount: number = 0, config: IAddablePathConfig[]): boolean => {
    if (config === undefined) {
        return false
    }
    // todo refactor this
    for (let i = 0; i < config.length; i++) {
        let userPath = cloneDeep(config[i].path)
        // replace * in user path with actual value from path
        if (userPath.length === currentPath.length) {
            for (let j = 0; j < config.length; j++) {
                if (userPath[j] === Constants.wildcard) {
                    userPath[j] = currentPath[j]
                }
            }

            if (!isEqual(currentPath, userPath)) {
                continue
            }

            if (config[i].options && config[i].options.limit && childrenCount > config[i].options.limit) {
                continue
            }

            return true
        }
    }

    return false
}

// todo write test for this
const sortKeysWithSortDefinition = (sortOrders: IDefaultFieldOrder[]) => (a, b) => {
    let sortOrderA = sortOrders.find((sortOrder) => sortOrder.name === a)
    let sortOrderB = sortOrders.find((sortOrder) => sortOrder.name === b)
    if (sortOrderA.order > sortOrderB.order) {
        return 0
    }
    if (sortOrderA.order < sortOrderB.order) {
        return -1
    }
    return 0
}

// todo write test for this
export const sortKeys = (data: string[], sortDef: IDefaultFieldOrder[]) => {
    const dataToSort = []
    const dataUnsorted = []
    for (let i = 0; i < data.length; i++) {
        const found = sortDef.find((o) => o.name === data[i])
        if (found) {
            dataToSort.push(data[i])
        } else {
            dataUnsorted.push(data[i])
        }
    }
    return [...dataToSort.sort(sortKeysWithSortDefinition(sortDef)), ...dataUnsorted]
}
