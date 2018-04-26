const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const proxy = require("express-http-proxy");

const config = require("./config");

// middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// routes
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.Surge_Authorization;
    // check if there is a token
    if (token) {
      const jwtOpts = {
        issuer: config.login.url,
        subject: config.surgeSite
      };
      // verify the token
      const decoded = await jwt.verify(token, config.jwtSecret, jwtOpts);
      return next();
    }
  } catch (err) {
    if (err.name !== "TokenExpiredError" && err.name !== "JsonWebTokenError") {
      return res.status(403).send("Something went wrong. Forbidden");
    }
  }
  const redirectUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  // if all else fails, assume the user isn't logged in and redirect to the login
  return res.redirect(
    `${config.login.url}/login?site=${encodeURIComponent(
      req.hostname
    )}&redirectUrl=${encodeURIComponent(redirectUrl)}`
  );
};

app.use(requireAuth);

app.use("/", proxy(config.surgeSite));

app.listen(config.proxy.port, () =>
  console.log(`Proxy server listening on port ${config.proxy.port}!`)
);
