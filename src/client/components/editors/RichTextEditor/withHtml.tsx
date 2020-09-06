import {Text, Transforms} from 'slate'
import escapeHtml from 'escape-html'
import {jsx} from 'slate-hyperscript'

export const withHtml = (editor) => {
    const {insertData, isInline, isVoid} = editor

    editor.isInline = (element) => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = (data) => {
        const html = data.getData('text/html')

        if (html) {
            const parsed = new DOMParser().parseFromString(html, 'text/html')
            const fragment = deserialize(parsed.body)
            Transforms.insertFragment(editor, fragment)
            return
        }

        insertData(data)
    }

    return editor
}

export const deserialize = (el) => {
    if (el.nodeType === 3) {
        return el.textContent
    } else if (el.nodeType !== 1) {
        return null
    } else if (el.nodeName === 'BR') {
        return '\n'
    }

    const {nodeName} = el
    let parent = el

    if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
        parent = el.childNodes[0]
    }
    // @ts-ignore
    const children = Array.from(parent.childNodes).map(deserialize).flat()

    if (el.nodeName === 'BODY') {
        return jsx('fragment', {}, children)
    }

    if (ELEMENT_TAGS[nodeName]) {
        const attrs = ELEMENT_TAGS[nodeName](el)
        return jsx('element', attrs, children)
    }

    if (TEXT_TAGS[nodeName]) {
        const attrs = TEXT_TAGS[nodeName](el)
        return children.map((child) => jsx('text', attrs, child))
    }

    return children
}

const serialize = (node) => {
    if (Array.isArray(node)) {
        if (Text.isText(node[0])) {
            return escapeHtml(node[0].text)
        }
    }
    if (Text.isText(node)) {
        return escapeHtml(node.text)
    }

    const children = node.children.map((n) => serialize(n)).join('')

    switch (node.type) {
        case 'quote':
            return `<blockquote><p>${children}</p></blockquote>`
        case 'paragraph':
            return `<p>${children}</p>`
        case 'link':
            return `<a href="${escapeHtml(node.url)}">${children}</a>`
        default:
            return children
    }
}

/*
const PasteHtmlExample = () => {
    const [value, setValue] = useState<Node[]>(initialValue)
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <RTLeaf {...props} />, [])
    const editor = useMemo(() => withHtml(withReact(withHistory(createEditor()))), [])
    return (
        <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
            <Editable renderElement={renderElement} renderLeaf={renderLeaf} placeholder="Paste in some HTML..." />
        </Slate>
    )
}*/

const ELEMENT_TAGS = {
    A: (el) => ({type: 'link', url: el.getAttribute('href')}),
    BLOCKQUOTE: () => ({type: 'quote'}),
    H1: () => ({type: 'heading-one'}),
    H2: () => ({type: 'heading-two'}),
    H3: () => ({type: 'heading-three'}),
    H4: () => ({type: 'heading-four'}),
    H5: () => ({type: 'heading-five'}),
    H6: () => ({type: 'heading-six'}),
    IMG: (el) => ({type: 'image', url: el.getAttribute('src')}),
    LI: () => ({type: 'list-item'}),
    OL: () => ({type: 'numbered-list'}),
    P: () => ({type: 'paragraph'}),
    PRE: () => ({type: 'code'}),
    UL: () => ({type: 'bulleted-list'})
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
    CODE: () => ({code: true}),
    DEL: () => ({strikethrough: true}),
    EM: () => ({italic: true}),
    I: () => ({italic: true}),
    S: () => ({strikethrough: true}),
    STRONG: () => ({bold: true}),
    U: () => ({underline: true})
}
