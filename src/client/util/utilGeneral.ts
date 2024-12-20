import {IObjectPath, IPage} from '../../shared/typings'

export const findPageById = (id: number, pages: IPage[]) => pages.find((p) => p.id === id)

/**
 * gets the next page id, this is a number that is one grater then the
 * the page with the greatest id
 *
 * @param pages
 * the pages defined within the mmanifest
 */
export const getNextPageId = (pages: IPage[]) => {
    const nextID = pages.reduce((max, page) => {
        return page.id > max ? page.id : max
    }, 0)
    return nextID + 1
}

export const prependKeyToObjectPath = (path: IObjectPath, key: string): IObjectPath => {
    return [key, ...path]
}

export const isPrimitive = (value): boolean => {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}
