# Surge Auth Demo

## Instructions

Clone the repo.

```bash
git clone git@github.com:nprail/surge-auth-demo.git
cd surge-auth-demo
```

Install the dependencies.

```bash
npm install
```

Start the proxy and login server.

```bash
npm start
```

Browse to http://localhost:3000

* **Username:** demo@example.com
* **Password:** demo

## Components

### Proxy Server

The proxy server simply proxies the Surge site and adds middleware that verifies that the token exists and is valid.

### Login Server

The login server hosts the login page and acts as the Surge login API.

## Flow

1.  User goes to a password protected site (e.g. protected.example.com)
2.  User is redirected to the Login Server and logs in
3.  User is redirected back to protected.example.com with new JWT token stored in a cookie
4.  The JWT token is then used to verify that the user has access to the site
