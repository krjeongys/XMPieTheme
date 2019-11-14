export const productTypes =
{
    KIT: 14
}


export const getIsNGProduct = (type) => {
    switch (type) {
        case productTypes.KIT:
            return true

        default:
            return false
    }
}