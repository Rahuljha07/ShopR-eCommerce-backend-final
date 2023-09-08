const express = require("express");
const server = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require("cookie-parser");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path  = require("path")
//webhooks
// This is your Stripe CLI webhook secret for testing your endpoint locally.
//TODO : We will capture actual order after deploying out server live on public URL
const endpointSecret = process.env.ENDPOINT_SECRET;
server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
//webhooks ends
//JWT Options
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;  //TODO: Add  this  secret key in your .env file
//session middleawrase
server.use(express.static(path.resolve(__dirname,'build')));
server.use(session({
  secret: process.env.SESSION_KEY,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}));
//passport middleware 

server.use(cookieParser());
server.use(passport.authenticate('session'));
server.use(cors({
  exposedHeaders: ["X-Total-Count"]
}));
//middleware to enable the json data in express
server.use(express.json()); // to parse the req.body

//router middleware
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(),categoriesRouter.router);
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/users",isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(),cartRouter.router);
server.use("/orders",isAuth(), orderRouter.router);
// local strategy applied to passport as middleware
passport.use('local', new LocalStrategy(
  {usernameField:'email'},
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      // console.log("users : ",{user});
      if (!user) {
          done(null, false, { message: "Invalid Credentials" }); //for safety
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: "Invalid Credentials" });
        }
        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
        done(null, {id:user.id,role:user.role,token}); // this line sends to serializer
      })
    } catch (error) {
      done(error);
    }
  }
));
//JWT Strategy
passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
  // console.log({ jwt_payload });
  const user = await User.findById(jwt_payload.id);
  try {
    if (user) {
      return done(null, sanitizeUser(user)); // this line sends to serializer
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error,false);
  }
}));

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  // console.log("serializeUser", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  // console.log("de-serializeUser", user); 

  process.nextTick(function () {
    return cb(null, user);
  });
});

//payment integration starts

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100, //for decimal compensation
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



//payment integration Ends

async function main() {
  await mongoose.connect(process.env.MONGODB_URL_LOCAL);
  console.log("database connected")

}
main().catch(err => console.log(err));


server.post("/products", createProduct);
server.post("*", (req, res) => {
  res.json({ message: "Invalid URL" });
});

server.listen(process.env.PORT, () => {
  console.log("Server is Listening on port 8080");
})