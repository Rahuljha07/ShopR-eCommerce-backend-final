const  express = require("express");
const server  = express();
const  mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const cors = require("cors");
server.use(cors({
    exposedHeaders: ["X-Total-Count"]
}));
//middleaware to enable the json data in express
server.use(express.json()); // to parse the req.body

//router middleaware
server.use("/products",productsRouter.router);
server.use("/categories",categoriesRouter.router);
server.use("/brands",brandsRouter.router);

async function  main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
    console.log("database connected")
}
main().catch(err => console.log(err));

server.get("/", (req, res)=>{
    res.json({message: "Hello World"});
})
server.post("/products",createProduct);
server.listen(8080, ()=>{
    console.log("Server is Listening on port 8080");
})