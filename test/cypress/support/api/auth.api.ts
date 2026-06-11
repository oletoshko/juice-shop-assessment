export interface AuthResponse {
  token: string;
  bid: number;
  umail: string;
}

export function login (
  email: string,
  password: string
): Cypress.Chainable<AuthResponse> {
  return cy
    .request({
      method: 'POST',
      url: '/rest/user/login',
      body: { email, password },
    })
    .then((res) => {
      expect(res.status).to.eq(200)
      return res.body.authentication as AuthResponse
    })
}
