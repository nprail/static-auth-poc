const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");

const config = require("./config");

const states = [];

// middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/assets", express.static("login-page"));

// login page route
app.get("/login", async (req, res) => {
  return res.sendFile(path.join(__dirname, "login-page/login.html"));
});

const deny = (res, message) => {
  return res.status(401).json({ message: `Access denied: ${message}` });
};

// login api route
app.post("/token", async (req, res) => {
  try {
    const { email, password, redirectUrl, site } = req.body;

    // find the user
    const user = config.users.find(user => user.email === email);

    // if there is no user, deny
    if (!user) {
      return deny(res, "User not found.");
    }

    // if the password doesn't match, deny
    if (user.password !== password) {
      return deny(res, "Password does not match.");
    }

    // prep the payload
    const payload = { email };
    const jwtOpts = {
      expiresIn: "24h",
      issuer: config.login.url,
      subject: config.surgeSite
    };

    // sign the token
    const token = await jwt.sign(payload, config.jwtSecret, jwtOpts);

    // set the token in cookies
    res.cookie("Surge_Authorization", token);

    const state = {
      id: uuidv4(),
      token,
      redirectUrl
    };
    // store the state in memory
    states.push(state);

    // respond with the token
    return res.status(200).json({
      redirect: `${config.login.url}/authorized?state=${state.id}`,
      state: state.id
    });
  } catch (err) {
    // if there was an error, deny
    return deny(res, "Something went wrong.");
  }
});

// authorized callback route
app.get("/authorized", async (req, res) => {
  const stateId = req.query.state;

  // get state from memory
  const state = states.find(state => state.id === stateId);

  // if there is not state, deny
  if (!state) {
    return deny(res, "Something went wrong.");
  }

  // set the token in cookies
  res.cookie("Surge_Authorization", state.token);

  return res.redirect(state.redirectUrl);
});

app.listen(config.login.port, () =>
  console.log(`Login server listening on port ${config.login.port}!`)
);
