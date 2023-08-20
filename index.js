const  express = require("express");
const server  = express();
const  mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");

const cors = require("cors");
server.use(cors({
    exposedHeaders: ["X-Total-Count"]
}));
//middleware to enable the json data in express
server.use(express.json()); // to parse the req.body

//router middleware
server.use("/products",productsRouter.router);
server.use("/categories",categoriesRouter.router);
server.use("/brands",brandsRouter.router);
server.use("/users",usersRouter.router);
server.use("/auth",authRouter.router);
server.use("/cart",cartRouter.router);
server.use("/orders",orderRouter.router);
async function  main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
//for atlas connection
const password = encodeURIComponent("ecommerce");

const MONGO_DB_URI = `mongodb+srv://ecommerce:ecommerce@cluster0.861gmvj.mongodb.net/ecommerce?retryWrites=true&w=majority`;  
  console.log("database connected")
await mongoose.connect(MONGO_DB_URI);
}
main().catch(err => console.log(err));

server.get("/", (req, res)=>{
    res.json({message: "Hello World"});
})
server.post("/products",createProduct);
server.post("*",(req,res)=>{
    res.json({message: "Invalid URL"});
});

server.listen(8080, ()=>{
    console.log("Server is Listening on port 8080");
})