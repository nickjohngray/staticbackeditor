import {IMoveNodeOrLeafToMethod, IObjectPath, ISection} from '../../../../shared/typings'
import * as React from 'react'
import Tree from '../../generic/Tree'
import {Constants, prependKeyToObjectPath} from '../../../util'

interface IProps {
    sections: ISection[]
    onUpdate: (text: string, objectPath: IObjectPath) => void
    onAdd: (jsonObject: object, objectPath: IObjectPath) => void
    onDelete: (objectPath: IObjectPath) => void
    imageDirectory: string
    projectUploadFolder: string
    skipNode?: string
    onMoveNodeOrLeafTo: IMoveNodeOrLeafToMethod
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
    body: 'body here',
    defaultFieldOrder: [
        {
            name: 'header',
            order: 0
        },
        {
            name: 'image',
            order: 1
        },
        {
            name: 'link',
            order: 2
        },
        {
            name: 'list',
            order: 3
        },
        {
            name: 'body',
            order: 4
        }
    ]
}

const list = {list: ['Click to edit list item']}

class SectionEditor extends React.Component<IProps, ISate> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => {
        return (
            <div className="sectionEditor">
                <button
                    className="new_button"
                    title="New"
                    onClick={() => this.props.onAdd(section, [Constants.sections])}>
                    +
                </button>
                <Tree
                    deletablePaths={[
                        // top most level  that happen to be sections
                        {path: [Constants.wildcard]},
                        // second level of sections
                        {path: [Constants.wildcard, 'sections', Constants.wildcard]},
                        // any image , link , list or body in second level sections
                        // this can be done with a third wild card like
                        // {path: [Constants.wildcard, 'sections', Constants.wildcard,  Constants.wildcard]},
                        {path: [Constants.wildcard, 'sections', Constants.wildcard, 'image']},
                        {path: [Constants.wildcard, 'sections', Constants.wildcard, 'link']},
                        {path: [Constants.wildcard, 'sections', Constants.wildcard, 'list']},
                        // any list item  in second level of sections of a list
                        {path: [Constants.wildcard, 'sections', Constants.wildcard, 'list', Constants.wildcard]},
                        {path: [Constants.wildcard, 'sections', Constants.wildcard, 'body']},
                        {path: ['image', 'src']},
                        {path: ['header']}
                    ]}
                    /* readonlyPaths={[
                        {path: [0, 'sections', 0, 'image', 'src']},
                        {path: ['image', 'src']},
                        {path: ['header']}
                    ]}*/
                    addablePathConfigs={[
                        // all top level objects in data, that happen to be sections
                        // all section keys in array
                        {
                            path: [Constants.wildcard], // any sections key
                            options: {
                                objectToAdd: section, // use this object for this path
                                onResolvePath: (path: IObjectPath) => {
                                    // this path needs sections appended to it so the object
                                    // gets added in the right right place
                                    return path.concat(['sections'])
                                }
                            }
                        },
                        {
                            // second level, athletes in categories
                            path: [Constants.wildcard, 'sections', Constants.wildcard],
                            options: {
                                showAddButton: false, // as a  button for each property will be made we dont want to show this
                                modifiableFields
                            }
                        },
                        // all lists in first level categories
                        {
                            path: [Constants.wildcard, 'sections', Constants.wildcard, 'list'],
                            options: {
                                limit: 10,
                                objectToAdd: 'Click to edit list item' // use this object for this path
                            }
                        }
                    ]}
                    imagesPaths={[['image']]}
                    imageDirectory={this.props.imageDirectory}
                    projectUploadFolder={this.props.projectUploadFolder}
                    onUpdate={(text: string, objectPath: IObjectPath) => this.props.onUpdate(text, fixPath(objectPath))}
                    onDelete={(objectPath: IObjectPath) => this.props.onDelete(fixPath(objectPath))}
                    onAdd={(jsonObject, objectPath: IObjectPath) => this.props.onAdd(jsonObject, fixPath(objectPath))}
                    onMoveNodeOrLeafTo={(fromIndex, toIndex, objectPath, fromField, toField) =>
                        this.props.onMoveNodeOrLeafTo(fromIndex, toIndex, fixPath(objectPath), fromField, toField)
                    }
                    objectToPrimitivePaths={[['image']]}
                    // we dont want the tree to make this or any of its children
                    // "opener": {"type": "tab","open": true},
                    ignoreKeys={['opener', 'defaultFieldOrder']}
                    nodeKeyForObjectsAndArrays={'header'}
                    data={this.props.sections}
                    skipNode="sections"
                    orderKey="defaultFieldOrder"
                />
            </div>
        )
    }
}

const fixPath = (objectPath: IObjectPath) => prependKeyToObjectPath(objectPath, Constants.sections)

export default SectionEditor
