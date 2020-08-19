import {ISection} from '../../../typings'
import * as React from 'react'
import Tree from '../Tree'
import {RouteComponentProps} from '@reach/router'

interface IProps {
    sections: ISection[]
    onUpdate: (text: string, objectPath: any[]) => void
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
            onUpdate={(text, objectPath) => this.props.onUpdate(text, objectPath)}
            skipKey="opener"
            nodeKeyForObjectsAndArrays="header"
            data={this.props.sections}
        />
    )
}

export default SectionEditor
