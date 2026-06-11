import type { CardPayload } from '../support/models/checkout'

// 4111111111111111 is a standard Luhn-valid Visa test card number
export const testCard: CardPayload = {
  fullName: 'Ion Popescu',
  cardNum: 4111111111111111,
  expMonth: 12,
  expYear: 2085
}
