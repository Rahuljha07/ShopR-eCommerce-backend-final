const express = require("express");
// const server = express();
require("dotenv").config();
const mongoose = require("mongoose");
const http = require('http');
const cors = require("cors");

// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const cookieParser = require("cookie-parser");

const { isAuth, sanitizeUser, cookieExtractor,authenticateToken } = require("./services/common");
// const path  = require("path")
//webhooks
// This is your Stripe CLI webhook secret for testing your endpoint locally.
//TODO : We will capture actual order after deploying out server live on public URL
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Ensure cookie-parser middleware is used

// Middleware
const corsOptions = {
    origin: [
      "http://127.0.0.1:4500",
      "http://localhost:4500",
      "http://localhost:4200",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://gen-purpose-builder.firebaseapp.com",
      "https://gen-purpose-builder.web.app",
      "https://gen-ai-admin.firebaseapp.com",
      "https://gen-ai-admin.web.app",
      "https://toolbuilder-9d47d.web.app",
      "https://toolbuilder-9d47d.firebaseapp.com"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "x-refresh-token", "Authorization"],
    exposedHeaders: ["X-Total-Count"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
app.use(cors(corsOptions));
// const endpointSecret = process.env.ENDPOINT_SECRET;
// server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// server.use(express.static(path.resolve(__dirname,'build')));


//router middleware
app.use("/products",  productsRouter.router);
app.use("/categories" ,categoriesRouter.router);
app.use("/brands",  brandsRouter.router);
app.use("/users", isAuth(), usersRouter.router);
app.use("/auth", authRouter.router);
app.use("/cart",isAuth(),cartRouter.router);
app.use("/orders", isAuth(), orderRouter.router);


// This is your test secret API key.
// const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// server.post("/create-payment-intent", async (req, res) => {
//   const { totalAmount } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: totalAmount*100, //for decimal compensation
//     currency: "inr",
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });



//payment integration Ends

async function main() {
  await mongoose.connect(process.env.MONGODB_URL_ATLAS);
  console.log("database connected")

}
main().catch(err => console.log(err));


app.post("/products", createProduct);
app.post("*", (req, res) => {
  res.json({ message: "Invalid URL" });
});

server.listen(process.env.PORT, () => {
  console.log("Server is Listening on port 8080");
})