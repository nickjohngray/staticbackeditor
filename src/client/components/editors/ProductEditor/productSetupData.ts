import {IVariation, IVariationItem} from '../../../../shared/typings'

export const genericVariationItem: IVariationItem = {
    optionValue: 'genericVariationItem option value 1'
}

export const genericVariation: IVariation = {
    type: 'generic',
    title: 'New genericVariationItem variation',
    item: [
        {
            optionValue: 'Pick 1...'
        },
        {
            optionValue: 'genericVariationItem option value 1'
        },
        {
            optionValue: 'genericVariationItem option value 2'
        }
    ]
}

export const priceVariationItem: IVariationItem = {
    optionValue: 'gold',
    price: 100
}

export const priceVariation: IVariation = {
    type: 'price',
    title: 'New priceVariationItem variation ',
    item: [
        {
            optionValue: 'Pick 1...',
            price: -1
        },
        {
            optionValue: 'gold',
            price: 100
        },
        {
            optionValue: 'silver',
            price: 50
        }
    ]
}

export const imageVariationItem: IVariationItem = {
    optionValue: 'The Man',
    image: 'man.png'
}

export const imageWithFirstItem = {
    type: 'image',
    title: 'New imageVariationItem variation',
    item: [
        {
            optionValue: 'New...',
            image: 'man.png'
        },
        {
            optionValue: 'Black Tshirt',
            image: 'strength_pit_black_tshirt.jpg'
        },
        {
            optionValue: 'The Man',
            image: 'man.png'
        }
    ]
}
