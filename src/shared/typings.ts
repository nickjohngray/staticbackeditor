export interface IPage {
    name: string
    path: string
    images?: IImage[]
    sections?: ISection[]
    FBAccessToken?: string
    template: string
    // this field is only used on the backend
    templateContent?: string
    editor?: PageContentEditors
    id: number
}

export type IPath = (string | number)[]

export enum PageContentEditors {
    sectionEditor = 'sectionEditor'
}

export interface ISection {
    image?: IImage
    header: string
    body: string
    sections?: ISection[]
    list?: string[]
    link?: string
    opener?: ISectionOpener
}

export interface ISectionOpener {
    type: OPENER_TYPE
    open: boolean
}

export enum OPENER_TYPE {
    TAB = 'TAB',
    EXPANDER = 'EXPANDER'
}

export interface IImage {
    src: string
    url?: string
}

export type Direction = 'UP' | 'DOWN'

export const UP = 'UP'
export const DOWN = 'DOWN'

export interface IManifest {
    appName: string
    imagePath: string
    pages: IPage[]
    products: IProduct[]
    FBAccessToken: string
    repoName: string
}
export enum APICallStatus {
    NOT_INIT = 'NOT_INIT',
    request = 'request',
    success = 'success',
    fail = 'fail'
}

export enum ApiMethods {
    post = 'post',
    get = 'get'
}

export interface IManifestAction {
    status?: APICallStatus
    error?: any
    api?: string
    payload?: {}
    backendPayload?: any
    type: string // force this latter
    method?: ApiMethods
}

export interface ICart {
    items: ICartItem[]
}

export interface IHistory {
    URL: string
}

/* a new id is made for each product added to the cart
  and a copy of the product definition
  if the product has a variations that the user has selected
  these will also be added

*/
export interface ICartItem {
    id: number
    product: IProduct
    selectedVariations: ISingleVariation[]
}

export interface IProduct {
    title: string
    description: string
    image: string
    type: string
    variations: IVariation[]
    price?: number
}

export interface ICartItemsByType {
    productKey: string
    items: ICartItem[]
    isVariation: boolean
    variationName: string
}

/*export interface ProductVariation {
    name: string,
    value: string
}*/

export interface ISingleVariation {
    name: string
    option: IVariationItem
}

export interface IVariation {
    title: string
    item: IVariationItem[]
}

export interface IVariationItem {
    optionValue: string
    image?: string
    price?: number
}

export enum PRODUCT_TYPES {
    TSHIRT = 'TSHIRT',
    RING = 'RING'
}

export interface IShop {
    products: IProduct[]
}

export interface IManifest2 {
    appName: string
    imagePath: string
    pages: IPage[]
    products: IProduct[]
    FBAccessToken: string
}

export interface IState {
    localize: any
    cart: ICart
    shop: IShop
    history: IHistory
}
