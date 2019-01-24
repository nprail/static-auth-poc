// config is static for demo purposes
module.exports = {
  site: 'https://auth-demo.surge.sh',
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
