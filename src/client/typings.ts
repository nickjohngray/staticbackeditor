export interface IPage {
    name: string
    path: string
    images?: IImage[]
    sections?: ISection[]
    FBAccessToken?: string
}

export interface ISection {
    image?: IImage
    header: string
    body: string
    sections?: ISection[]
    list?: string[]
    link?: string
    opener?: SectionOpener
}

export interface SectionOpener {
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

export type Direction =
    ('UP' | 'DOWN')

export const UP = 'UP'
export const DOWN = 'DOWN'


export interface IManifest {
    appName: string
    imagePath: string
    pages: IPage[]
    products: IProduct[]
    FBAccessToken: string,
    repoName: string
}
export enum IBackendStatus {
    NOT_INIT = 'NOT_INIT',
    REQUEST = 'REQUEST',
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL'
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
    selectedVariations: SingleVariation[]
}

export interface IProduct {
    title: string;
    description: string;
    image: string;
    type: string;
    variations: Variation[];
    price?: number;
}

export interface ICartItemsByType {
    productKey: string;
    items: ICartItem[];
    isVariation: boolean;
    variationName: string;
}

/*export interface ProductVariation {
    name: string,
    value: string
}*/

export type SingleVariation = {
    name: string;
    option: VariationItem;
};

export type Variation = {
    title: string;
    item: VariationItem[];
};

export type VariationItem = {
    optionValue: string;
    image?: string;
    price?: number;
};

export enum PRODUCT_TYPES {
    TSHIRT = 'TSHIRT',
    RING = 'RING'
}

export type IShop = {
    products: IProduct[];
};

export type IManifest2  ={
    appName: string;
    imagePath: string;
    pages: IPage[];
    products: IProduct[];
    FBAccessToken: string;
}

export interface IState {
    localize: any;
    cart: ICart;
    shop: IShop;
    history: IHistory;
}
