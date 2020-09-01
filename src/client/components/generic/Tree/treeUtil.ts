import {IDefaultFieldOrder, IObjectPath} from '../../../../shared/typings'

import {cloneDeep, isEqual} from 'lodash'
import {Constants} from '../../../util'
import {IAddablePathConfig, IFieldTypePathConfig, INonDragPathConfig} from './Tree'

// todo write test for this
export const getConfigForPath = (
    currentPath: IObjectPath,
    configs: IAddablePathConfig[] | IFieldTypePathConfig[] | INonDragPathConfig[]
): IAddablePathConfig | IFieldTypePathConfig | INonDragPathConfig | null => {
    if (configs === undefined) {
        return null
    }
    for (let i = 0; i < configs.length; i++) {
        let configPath = [...configs[i].path]
        // replace * in user path with actual value from path
        // if this user path has the sane amount of items or more
        if (configPath.length >= currentPath.length - 1) {
            for (let j = 0; j < configPath.length; j++) {
                if (configPath[j] === Constants.wildcard) {
                    configPath[j] = currentPath[j]
                }
            }
        }
        if (isEqual(currentPath, configPath)) {
            return configs[i]
        }
    }
    return null
}

export const isCurrentPathOkForConfig = (
    currentPath: IObjectPath,
    childrenCount: number = 0,
    config: IAddablePathConfig[]
): boolean => {
    if (config === undefined) {
        return false
    }
    // todo refactor this
    for (let i = 0; i < config.length; i++) {
        let configPath = [...config[i].path]
        // replace * in user path with actual value from path
        // if this user path has the sane amount of items or more
        if (configPath.length >= currentPath.length) {
            for (let j = 0; j < configPath.length; j++) {
                if (configPath[j] === Constants.wildcard) {
                    configPath[j] = currentPath[j]
                }
            }
            if (!isEqual(currentPath, configPath)) {
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
