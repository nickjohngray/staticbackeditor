import {IPath} from '../../../../shared/typings'
import {cloneDeep, isEqual} from 'lodash'
import {Constants} from '../../../util'
import {IAddablePathConfig} from './Tree'

export const getConfigForPath = (currentPath: IPath, configs: IAddablePathConfig[]): IAddablePathConfig | null => {
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

export const isOk = (currentPath: IPath, childrenCount: number, config: IAddablePathConfig[]): boolean => {
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
