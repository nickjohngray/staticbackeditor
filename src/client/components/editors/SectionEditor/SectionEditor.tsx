import {ISection} from '../../../typings'
import * as React from 'react'
import Tree from '../Tree'

interface IProps {
    pageSections: ISection[]
}

interface ISate {
    open: boolean
}

class SectionEditor extends React.Component<IProps, ISate> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => <Tree data={this.props.pageSections} />
}
