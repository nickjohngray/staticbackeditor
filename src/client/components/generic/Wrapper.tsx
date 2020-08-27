export const Wrapper = ({condition, wrapper, children}) => (condition ? wrapper(children) : children)
