export interface BasketItem {
  id: number
  BasketId: number
  ProductId: number
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface BasketProduct {
  id: number
  name: string
  price: number
  deluxePrice: number
  BasketItem: BasketItem
}

export interface Basket {
  id: number
  Products: BasketProduct[]
}
