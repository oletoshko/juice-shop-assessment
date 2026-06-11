import type { AuthResponse } from './api/auth.api'
import * as AuthApi from './api/auth.api'
import * as BasketApi from './api/basket.api'
import type { Basket } from './models/basket'

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaApi(email: string, password: string): Chainable<AuthResponse>
      clearBasket(token: string, basketId: number): Chainable<void>
    }
  }
}

Cypress.Commands.add('loginViaApi', (email: string, password: string) => {
  return AuthApi.login(email, password)
})

Cypress.Commands.add('clearBasket', (token: string, basketId: number) => {
  BasketApi.getBasket(token, basketId).then((basket: Basket) => {
    basket.Products?.forEach(product => {
      if (product.BasketItem) {
        BasketApi.removeItem(token, product.BasketItem.id)
      }
    })
  })
})

export {}
