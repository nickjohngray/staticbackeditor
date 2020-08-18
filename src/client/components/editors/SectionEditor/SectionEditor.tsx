import {ISection} from '../../../typings'
import * as React from 'react'
import Tree from '../Tree'

interface IProps {
    sections: ISection[]
    onUpdate: (sections: ISection[]) => void
}

interface ISate {
    open: boolean
}

class SectionEditor extends React.Component<IProps, ISate> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => (
        <Tree
            onUpdate={(data) => this.props.onUpdate(data as ISection[])}
            skipKey="opener"
            nodeKeyForObjectsAndArrays="header"
            data={this.props.sections}
        />
    )
}

export default SectionEditor
