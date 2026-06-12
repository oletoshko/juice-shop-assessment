export interface User {
  readonly email: string
  readonly password: string
}

export const users: Record<'customer', User> = {
  customer: { email: 'bender@juice-sh.op', password: 'OhG0dPlease1nsertLiquor!' }
}
