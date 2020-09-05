import React from 'react'

export interface IMainContext {
    isDebug?: boolean
    setMainContext?: (mainContext: IMainContext) => void
}

const MainContext = React.createContext<IMainContext>({
    isDebug: false,
    setMainContext: undefined
})

export default MainContext
