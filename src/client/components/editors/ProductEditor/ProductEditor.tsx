import {IMoveNodeOrLeafToMethod, IObjectPath, IProduct, ISection} from '../../../../shared/typings'
import * as React from 'react'
import Tree from '../../generic/Tree'
import {Constants, prependKeyToObjectPath} from '../../../util'

interface IProps {
    products: IProduct[]
    onUpdate?: (text: string, objectPath: any[]) => void
    onAdd?: (jsonObject: object, objectPath: any[]) => void
    onDelete?: (objectPath: any[]) => void
    imageDirectory?: string
    projectUploadFolder?: string
    onMoveNodeOrLeafTo?: IMoveNodeOrLeafToMethod
}

const product: IProduct = {
    type: 'dummy',
    title: 'dummy prod',
    description: 'Adummy',
    price: 1,
    image: 'strength_pit_black_training_tshirt.jpg'
}

const variationsModifiable = [
    {title: 'Size'},
    {
        item: [
            {
                optionValue: 'Pick 1...'
            },
            {
                optionValue: 'Small'
            },
            {
                optionValue: 'Medium'
            },
            {
                optionValue: 'Large'
            },
            {
                optionValue: 'XL'
            },
            {
                optionValue: '2XL'
            },
            {
                optionValue: '3XL'
            },
            {
                optionValue: '4XL'
            },
            {
                optionValue: '5XL'
            },
            {
                optionValue: '6XL'
            }
        ]
    }
]

const variations = [
    {
        variations: [
            {
                title: 'Size',
                item: [
                    {
                        optionValue: 'Pick 1...'
                    },
                    {
                        optionValue: 'Small'
                    },
                    {
                        optionValue: 'Medium'
                    },
                    {
                        optionValue: 'Large'
                    },
                    {
                        optionValue: 'XL'
                    },
                    {
                        optionValue: '2XL'
                    },
                    {
                        optionValue: '3XL'
                    },
                    {
                        optionValue: '4XL'
                    },
                    {
                        optionValue: '5XL'
                    },
                    {
                        optionValue: '6XL'
                    }
                ]
            },
            {
                title: 'Color',
                item: [
                    {
                        optionValue: 'Pick 1...',
                        image: 'strength_pit_black_tshirt.jpg'
                    },
                    {
                        optionValue: 'Black',
                        image: 'strength_pit_black_tshirt.jpg'
                    },
                    {
                        optionValue: 'Red',
                        image: 'strength_pit_red_tshirt.png'
                    },
                    {
                        optionValue: 'White',
                        image: 'strength_pit_white_tshirt.png'
                    },
                    {
                        optionValue: 'Navy',
                        image: 'strength_pit_navy_tshirt.png'
                    },
                    {
                        optionValue: 'Chacoal',
                        image: 'strength_pit_charcoal_tshirt.png'
                    }
                ]
            }
        ]
    }
]

class ProductEditor extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => (
        <div className="sectionEditor">
            <button className="new_button" title="New" onClick={() => this.props.onAdd(product, [Constants.products])}>
                +
            </button>

            <Tree
                imagesPaths={[['image']]}
                imageDirectory={this.props.imageDirectory}
                projectUploadFolder={this.props.projectUploadFolder}
                onUpdate={(text: string, objectPath: IObjectPath) => {
                    this.props.onUpdate(text, fixPath(objectPath))
                }}
                onDelete={(objectPath: IObjectPath) => this.props.onDelete(fixPath(objectPath))}
                onAdd={(jsonObject, objectPath: IObjectPath) => this.props.onAdd(jsonObject, fixPath(objectPath))}
                onMoveNodeOrLeafTo={(fromIndex, toIndex, objectPath, fromField, toField) =>
                    this.props.onMoveNodeOrLeafTo(fromIndex, toIndex, fixPath(objectPath), fromField, toField)
                }
                nodeKeyForObjectsAndArrays={'title'}
                data={this.props.products}
                // allow delete of top level product object
                deletablePaths={[{path: [Constants.wildcard]}, {path: [Constants.wildcard, 'variations']}]}
                addablePathConfigs={[
                    {
                        // all top level objects that happen to be products
                        path: [Constants.wildcard],
                        // define product fields that can be add/removed for a product
                        // in this case variations
                        options: {modifiableFields: variations, showAddButton: false, limit: 1}
                    }
                ]}
                dataTypePathConfigs={[
                    {
                        // all top level objects that happen to be products
                        path: [Constants.wildcard, 'price'],
                        // define product fields that can be add/removed for a product
                        // in this case variations
                        options: {dataType: Constants.number}
                    }
                ]}
            />
        </div>
    )
}

const fixPath = (objectPath: IObjectPath) => prependKeyToObjectPath(objectPath, Constants.products)

export default ProductEditor
