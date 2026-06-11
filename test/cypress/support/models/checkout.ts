// Payload types represent the shape of data sent TO the API (no server-generated fields)
export interface AddressPayload {
  fullName: string
  mobileNum: string
  zipCode: string
  streetAddress: string
  city: string
  state: string
  country: string
}

// Response type extends the payload with server-generated fields
export interface Address extends AddressPayload {
  id: number
  UserId: number
}

export interface CardPayload {
  fullName: string
  cardNum: number  // 16-digit number on creation
  expMonth: number
  expYear: number
}

export interface Card {
  id: number
  UserId: number
  fullName: string
  cardNum: string  // masked in API response, e.g. "************1111"
  expMonth: number
  expYear: number
}

export interface DeliveryMethod {
  id: number
  name: string
  price: number
  deluxePrice: number
  eta: number
  icon: string
}

export interface OrderDetails {
  paymentId: number | 'wallet'
  addressId: number
  deliveryMethodId: number
}

export interface CheckoutPayload {
  orderDetails: OrderDetails
}

export interface OrderConfirmation {
  orderConfirmation: string
}
