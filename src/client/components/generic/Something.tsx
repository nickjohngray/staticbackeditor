interface ISomething {
    warpInParent: boolean
    content: any
    children: any
}

export const Something = ({warpInParent, content, children}: ISomething) => {
    return warpInParent ? content(children) : children
}
