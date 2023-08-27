const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { User } = require("./model/User");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { isAuth, sanitizeUser } = require("./services/common");
const SECRET_KEY = 'SECRET_KEY';
//JWT Options
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;  //TODO: Add  this  secret key in your .env file


//session middleawrase
server.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}));
//passport middleware 
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
  async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username });
      // console.log("users : ",{user});
      if (!user) {
        return done(null, false, { message: "Invalid Credentials" });
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: "Invalid Credentials" });
        }
        const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
        done(null, token); // this line sends to serializer
      })
    } catch (error) {
      done(error);
    }
  }
));
//JWT Strategy
passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log({ jwt_payload });
  const user = await User.findOne({ id: jwt_payload.sub });
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
  console.log("serializeUser", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  console.log("de-serializeUser", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected")

  //for atlas connection
  // const password = encodeURIComponent("ecommerce");
  // const MONGO_DB_URI = `mongodb+srv://ecommerce:ecommerce@cluster0.861gmvj.mongodb.net/ecommerce?retryWrites=true&w=majority`;  
  // await mongoose.connect(MONGO_DB_URI);
}
main().catch(err => console.log(err));


server.post("/products", createProduct);
server.post("*", (req, res) => {
  res.json({ message: "Invalid URL" });
});

server.listen(8080, () => {
  console.log("Server is Listening on port 8080");
})