// config is static since this is a proof of concept
module.exports = {
  site: 'https://nprail.github.io/static-auth-poc',
  jwtSecret: 'demo',
  users: [
    {
      email: 'demo@example.com',
      password: 'demo'
    }
  ],
  login: {
    port: 3001,
    get url () {
      return `http://localhost:${this.port}`
    }
  },
  proxy: { port: 3000 }
}
