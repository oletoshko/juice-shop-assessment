export interface ProductRef {
  readonly id: number
}

// Product IDs as seeded by Juice Shop
export const products: readonly ProductRef[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 }
]
