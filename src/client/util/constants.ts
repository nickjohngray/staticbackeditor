export enum Constants {
    manifest = 'manifest',
    ui = 'ui',
    projectUploadFolder = 'projectUploadFolder',
    sections = 'sections',
    wildcard = '*',
    products = 'products',
    string = 'string',
    number = 'number',
    readonly = 'readonly',
    richText = 'richText',
    richTextData = 'richTextData'
}

// todo change this to union types like 'a' | 'b'
export enum PageContentEditors {
    sectionEditor = 'sectionEditor',
    productEditor = 'productEditor',
    richTextEditor = 'richTextEditor',
    incredibleEditor = 'incredibleEditor'
}

export enum OPENER_TYPE {
    TAB = 'TAB',
    EXPANDER = 'EXPANDER'
}
