export interface User {
  readonly email: string
  readonly password: string
}

export const users: Record<'customer' | 'admin', User> = {
  customer: { email: 'jim@juice-sh.op', password: 'ncc-1701' },
  admin: { email: 'admin@juice-sh.op', password: 'admin123' }
}
