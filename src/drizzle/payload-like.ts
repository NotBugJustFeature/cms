import { CollectionConfig } from './types'

export const Orders: CollectionConfig = {
    slug: 'orders',
    fields: [
        {
            name: 'total',
            type: 'number',
            required: true
        },
        {
            name: 'placedBy',
            type: 'relationship',
            relationTo: 'customers',
            required: true
        }
    ]
}
export const posts = mysqlTable('orders', {
    total: int('total'),
    placedBy: text('placedBy')
})
