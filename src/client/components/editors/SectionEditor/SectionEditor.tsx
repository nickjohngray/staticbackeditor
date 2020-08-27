import {IPath, ISection} from '../../../../shared/typings'
import * as React from 'react'
import Tree from '../../generic/Tree'

interface IProps {
    sections: ISection[]
    onUpdate: (text: string, objectPath: any[]) => void
    onAdd: (jsonObject: object, objectPath: any[]) => void
    onDelete: (objectPath: any[]) => void
    imageDirectory: string
    projectUploadFolder: string
}

interface ISate {
    open: boolean
}

const modifiableFields = [
    {link: 'https://strengthpitotara.co.nz'},
    {
        image: {
            src: 'man.png'
        }
    },
    {header: 'Click to edit name'},
    {list: ['Click to edit list item']},
    {body: 'Click to edit body'}
]

const section: ISection = {
    link: 'https://www.facebook.com/Eddiejowilliams',
    image: {
        src: 'man.png'
    },
    header: 'Header Text here',
    list: ['List items here'],
    body: 'body here'
}

const list = {list: ['Click to edit list item']}

class SectionEditor extends React.Component<IProps, ISate> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => (
        <Tree
            readonlyPaths={[[0, 'sections', 0, 'image', 'src'], ['image', 'src'], ['header']]}
            addablePathConfigs={[
                // all top level objects in data, that happen to be sections
                // all section keys in array
                {
                    path: ['*'], // any sections key
                    options: {
                        objectToAdd: section, // use this object for this path
                        onResolvePath: (path: IPath) => {
                            // this path needs sections appended to it so the object
                            // gets added in the right right place
                            return path.concat(['sections'])
                        }
                    }
                },
                {
                    // second level, athletes in categories
                    path: ['*', 'sections', '*'],
                    options: {
                        showAddButton: false, // as a  button for each property will be made we dont want to show this
                        modifiableFields
                    }
                },
                // all lists in first level categories
                {
                    path: [0, 'sections', '*', 'list'],
                    options: {
                        limit: 10,
                        objectToAdd: 'Click to edit list item' // use this object for this path
                    }
                }
            ]}
            imagesPaths={[['image']]}
            imageDirectory={this.props.imageDirectory}
            projectUploadFolder={this.props.projectUploadFolder}
            onUpdate={this.props.onUpdate}
            onDelete={this.props.onDelete}
            onAdd={this.props.onAdd}
            objectToPrimitivePaths={[['image']]}
            // we dont want the tree to make this or any of its children
            // "opener": {"type": "tab","open": true},
            ignoreKeys={['opener']}
            nodeKeyForObjectsAndArrays="header"
            data={this.props.sections}
            skipNode="sections"
        />
    )
}

export default SectionEditor
