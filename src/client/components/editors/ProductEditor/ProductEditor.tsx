import {IMoveNodeOrLeafToMethod, IObjectPath, IProduct, ISection} from '../../../../shared/typings'
import * as React from 'react'
import Tree from '../../generic/Tree'
import {Constants, prependKeyToObjectPath} from '../../../util'
import {IObjectsToAdd} from '../../generic/Tree/Tree'
import './ProductEditor.css'
import {cloneDeep} from 'lodash'
import {
    genericVariation,
    genericVariationItem,
    imageVariationItem,
    imageWithFirstItem,
    priceVariation,
    priceVariationItem
} from './productSetupData'

interface IProps {
    products: IProduct[]
    onUpdate?: (text: string, objectPath: any[]) => void
    onAdd?: (jsonObject: object, objectPath: any[]) => void
    onDelete?: (objectPath: any[]) => void
    imageDirectory?: string
    projectUploadFolder?: string
    onMoveNodeOrLeafTo?: IMoveNodeOrLeafToMethod
}

const variations = {
    generic: genericVariationItem,
    price: priceVariationItem,
    image: imageVariationItem
}

const variationsWithFirstOption = {
    generic: genericVariation,
    price: priceVariation,
    image: imageWithFirstItem
}

const product: IProduct = {
    type: 'New type',
    title: 'New .. Product',
    description: '[{"type":"paragraph","children":[{"text":"New... Product"}]}]',
    price: 1,
    image: 'man.png',
    variations: []
}

class ProductEditor extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    render = () => (
        <div className="sectionEditor">
            <button className="new_button" title="New" onClick={() => this.props.onAdd(product, [Constants.products])}>
                Products +
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
                // use products title key  for node names and
                //  variations  optionValue key for node names
                /*  nodeKeyForObjectsAndArrays={['title', 'optionValue']}*/
                nodeKeyForObjectsAndArrays={['title', 'optionValue']} // imageVariationItem
                // convert these simple product objects to leaves
                collapse={[
                    {path: ['*', 'description']},
                    {path: ['*', 'type']},
                    {path: ['*', 'price']},
                    {path: ['*', 'image']},
                    {path: ['*', 'title']},
                    /* any variations item value */
                    {path: ['*', 'variations', '*', 'item', '*', 'optionValue']},
                    {path: ['*', 'variations', '*', 'item', '*', 'image']}
                    /* {path: ['*', 'variations', '*', 'item', '*']}*/
                ]}
                // remove the default  opener key from object and collapse it
                collapseSingle={true}
                /* 3variations0item0 */
                ignoreKeys={[
                    // dont show variation  Pick 1... option
                    {path: ['*', 'variations', '*', 'item', 0]},
                    // dont show variation type
                    {path: ['*', 'variations', '*', 'type']}
                ]}
                data={this.props.products}
                // allow delete of top level product object
                deletable={[
                    {path: ['*']},
                    // allow deletion of any variation
                    {path: ['*', 'variations', '*']},
                    //    2variations0item1optionValue
                    // allow deletion of any variation's item value
                    {
                        path: ['*', 'variations', '*', 'item', '*', 'optionValue'],
                        options: {
                            onResolvePath: (path: IObjectPath) => {
                                // this path needs optionValue removed before going
                                // to reducer
                                path.pop()
                                return [...path]
                            }
                        }
                    }
                ]}
                addable={[
                    // todo make variationss optional in static back
                    /* {
                        // all top level objects that happen to be products
                        path: ['*'],
                        // define product fields that can be add/removed for a product
                        // in this case variations
                        options: {modifiableFields: variations, showAddButton: false, limit: 1}
                    },*/
                    {
                        path: ['*', 'variations', '*', 'item'],
                        options: {
                            /*object: {
                                optionValue: 'Pick 1...'
                            }*/
                            object: (path: IObjectPath) => {
                                // find the current varaition in the parent path
                                // this must be done as the user can add
                                // different vstions types.
                                // then return it
                                /*return {
                                    type: 'genericVariationItem',
                                    title: 'New...',
                                    item: [
                                        {
                                            optionValue: 'Pick 1...'
                                        },
                                        {
                                            optionValue: 'New...'
                                        }
                                    ]
                                }*/
                                const prodIdx = path[0]
                                const variationIndex = path[2]
                                // find the product
                                const prod: IProduct = this.props.products[prodIdx]
                                const variation = prod.variations[variationIndex]
                                return cloneDeep(variations[variation.type])
                                const values = Object.values(variations)
                                const keys = Object.keys(variations)
                                const idx = keys.indexOf(variation.type)
                                return values[idx]
                            }
                        }
                    },
                    {
                        // make a split button that allows user to add
                        // all variation types
                        path: ['*', 'variations'],
                        options: {
                            object: [
                                {name: '', object: cloneDeep(variationsWithFirstOption.generic)},
                                {name: 'Price Variation', object: cloneDeep(variationsWithFirstOption.price)},
                                {name: 'Image Variation', object: cloneDeep(variationsWithFirstOption.image)}
                            ] as IObjectsToAdd[]
                        }
                    }
                ]}
                typeable={[
                    {
                        // define product price as a number field
                        path: ['*', 'price'],
                        options: {fieldType: Constants.number}
                    },
                    {
                        // define description as a rich text field
                        path: ['*', 'description'],
                        options: {fieldType: Constants.richText}
                    }

                    /* {
                        //all variations PICK 1... option
                        path: ['*', 'variations', '*', 'item', 0, '*'],
                        options: {fieldType: Constants.readonly}
                    }*/
                ]}
                nonDragable={[
                    {
                        // all product fields
                        path: ['*', '*']
                    },
                    // title
                    {
                        path: ['*', '*', '*']
                    },
                    // item
                    {
                        path: ['*', '*', '*', '*']
                    },
                    // opener
                    {
                        path: ['*', '*', '*', '*', '*']
                    },
                    // option value and priceVariationItem
                    {
                        path: ['*', '*', '*', '*', '*', '*']
                    }
                ]}
                objectToPrimitivePaths={[{path: ['*', 'type']}]}
            />
        </div>
    )
}

const fixPath = (objectPath: IObjectPath) => prependKeyToObjectPath(objectPath, Constants.products)

export default ProductEditor
