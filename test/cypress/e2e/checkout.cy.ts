import { BasketApi, CheckoutApi } from '../support/api'
import { users } from '../fixtures/users'
import { products } from '../fixtures/products'
import { roAddress } from '../fixtures/addresses'
import { testCard } from '../fixtures/payments'
import type { BasketItem } from '../support/models'

describe('Purchase checkout flow', () => {
  let token: string
  let basketId: number
  const addedItems: BasketItem[] = []

  before(() => {
    cy.loginViaApi(users.customer.email, users.customer.password).then(auth => {
      token = auth.token
      basketId = auth.bid
    })
    cy.then(() => cy.clearBasket(token, basketId))
  })

  context('basket preparation', () => {
    it('adds 5 products to the basket', () => {
      products.forEach(product => {
        BasketApi.addItem(token, basketId, product.id, 1).then(item => {
          addedItems.push(item)
        })
      })

      BasketApi.getBasket(token, basketId).then(basket => {
        expect(basket.Products, 'basket should contain 5 products').to.have.length(5)
      })
    })

    it('removes the fifth product from the basket', () => {
      BasketApi.removeItem(token, addedItems[4].id)

      BasketApi.getBasket(token, basketId).then(basket => {
        expect(basket.Products, 'basket should have 4 products after removal').to.have.length(4)
        const remainingProductIds = basket.Products.map(p => p.id)
        expect(remainingProductIds, 'removed product should no longer appear in basket').not.to.include(products[4].id)
      })
    })

    it('quantity update → recalculates the basket total correctly', () => {
      let totalBefore: number
      let firstProductPrice: number

      BasketApi.getBasket(token, basketId).then(basket => {
        totalBefore = basket.Products.reduce((sum, p) => sum + p.price * p.BasketItem.quantity, 0)
        firstProductPrice = basket.Products.find(p => p.BasketItem.id === addedItems[0].id)!.price
        expect(totalBefore, 'initial basket total should be greater than zero').to.be.greaterThan(0)
      })

      cy.then(() => BasketApi.updateItem(token, addedItems[0].id, 3)).then(updated => {
        expect(updated.quantity, 'quantity should reflect the requested update').to.eq(3)
      })

      BasketApi.getBasket(token, basketId).then(basket => {
        const totalAfter = basket.Products.reduce((sum, p) => sum + p.price * p.BasketItem.quantity, 0)
        // quantity increased from 1 → 3, so total should grow by 2 × firstProductPrice
        const expectedTotal = totalBefore + firstProductPrice * 2
        expect(totalAfter, 'basket total should reflect the quantity change').to.be.closeTo(expectedTotal, 0.01)
      })
    })
  })

  context('order placement', () => {
    let addressId: number
    let cardId: number
    let deliveryMethodId: number

    it('adds a valid Romanian delivery address', () => {
      CheckoutApi.createAddress(token, roAddress).then(address => {
        expect(address.id, 'address should be persisted with an id').to.be.a('number')
        expect(address.zipCode, 'postcode should match the submitted value').to.eq(roAddress.zipCode)
        expect(address.country, 'country should be Romania').to.eq(roAddress.country)
        addressId = address.id
      })
    })

    it('selects the first available delivery method', () => {
      CheckoutApi.getDeliveryMethods(token).then(methods => {
        expect(methods, 'at least one delivery method should be available').to.have.length.greaterThan(0)
        expect(methods[0].id, 'delivery method should have a numeric id').to.be.a('number')
        deliveryMethodId = methods[0].id
      })
    })

    it('adds a valid Romanian payment card', () => {
      CheckoutApi.createCard(token, testCard).then(card => {
        expect(card.id, 'card should be persisted with an id').to.be.a('number')
        expect(card.expMonth, 'expiry month should match').to.eq(testCard.expMonth)
        expect(card.expYear, 'expiry year should match').to.eq(testCard.expYear)
        cardId = card.id
      })
    })

    it('review summary → basket contains items ready for checkout', () => {
      BasketApi.getBasket(token, basketId).then(basket => {
        expect(basket.Products, 'basket should have at least one product').to.have.length.greaterThan(0)
        const total = basket.Products.reduce((sum, p) => sum + p.price * p.BasketItem.quantity, 0)
        expect(total, 'basket total should be greater than zero').to.be.greaterThan(0)
      })
    })

    it('places the order and receives a confirmation', () => {
      // cy.then() synchronizes here: addressId, cardId, deliveryMethodId are all resolved before checkout
      cy.then(() =>
        CheckoutApi.checkout(token, basketId, {
          orderDetails: {
            paymentId: cardId,
            addressId,
            deliveryMethodId
          }
        })
      ).then(confirmation => {
        expect(confirmation.orderConfirmation, 'an order confirmation ID should be returned').to.be.a('string')
        expect(confirmation.orderConfirmation, 'order ID should follow the expected format').to.match(/^[0-9a-f]{4}-[0-9a-f]{16}$/i)
      })
    })
  })
})
