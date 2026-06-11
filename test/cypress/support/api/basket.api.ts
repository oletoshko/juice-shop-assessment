import type { Basket, BasketItem } from '../models/basket'

function authHeaders (token: string) {
  return { Authorization: `Bearer ${token}` }
}

export function getBasket (
  token: string,
  basketId: number
): Cypress.Chainable<Basket> {
  return cy
    .request({
      method: 'GET',
      url: `/rest/basket/${basketId}`,
      headers: authHeaders(token),
    })
    .then((res) => {
      expect(res.status).to.eq(200)
      return res.body.data as Basket
    })
}

export function addItem (
  token: string,
  basketId: number,
  productId: number,
  quantity = 1
): Cypress.Chainable<BasketItem> {
  return cy
    .request({
      method: 'POST',
      url: '/api/BasketItems',
      headers: authHeaders(token),
      body: { BasketId: basketId, ProductId: productId, quantity },
    })
    .then((res) => {
      expect(res.status).to.eq(200)
      return res.body.data as BasketItem
    })
}

export function updateItem (
  token: string,
  itemId: number,
  quantity: number
): Cypress.Chainable<BasketItem> {
  return cy
    .request({
      method: 'PUT',
      url: `/api/BasketItems/${itemId}`,
      headers: authHeaders(token),
      body: { quantity },
    })
    .then((res) => {
      expect(res.status).to.eq(200)
      return res.body.data as BasketItem
    })
}

export function removeItem (token: string, itemId: number): void {
  cy.request({
    method: 'DELETE',
    url: `/api/BasketItems/${itemId}`,
    headers: authHeaders(token)
  })
    .its('status')
    .should('eq', 200)
}
