import React from 'react'

/*interface IStaticBackEditor {
    isDebug: false
    setIsDebug: (setIsDebug: boolean) => void
}
const state = {
    isDebug: null,
    setProfile: this.setProfile
}
const setContext = (data: IStaticBackEditor) => {
    this.setState({data})
}*/

const StaticBackEditor = React.createContext({isDebug: true})
export default StaticBackEditor
