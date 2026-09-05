export interface Product {
    productID: number
    name: string
    unitPrice: number
    photo: string | null
    description: string | null
    orders: unknown[] | null
}
