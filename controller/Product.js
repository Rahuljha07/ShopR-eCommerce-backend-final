//controller
const {Product} = require("../model/Product");
exports.createProduct=async(req,res)=>{
    try{
        const product = new Product(req.body);
        const doc = await product.save();
        res.status(201).json(doc);
    }catch(error){
        res.status(400).json(error);
    }
}

exports.fetchAllProducts=async(req,res)=>{
 //filter = {"category":["smartphones","laptops"]}
  //sort = {_sort:"price",_order="desc"}
  //pagination = {_page=1,_limit=10}  // _page=1&_limit=10
  //for in  loop - key of object
  // {_page: 4, _limit: 10}
  //Todo : We have to try with multi category
 let query =  Product.find({deleted:{$ne:true}});
 let totalProductsQuery  =  Product.find({deleted:{$ne:true}});

 if(req.query.category){
    query = query.find({category:req.query.category});
    totalProductsQuery = totalProductsQuery.find({category:req.query.category});

 }
 if(req.query.brand){
    query = query.find({brand:req.query.brand});
    totalProductsQuery = totalProductsQuery.find({brand:req.query.brand});
 }

 // todo : sorting should be based on discount price not Actual Price
 if(req.query._sort && req.query._order){
    query = query.sort({[req.query._sort]:req.query._order});
    // totalProductsQuery = totalProductsQuery.sort({[req.query._sort]:req.query._order});
 }

 const totalDocs = await totalProductsQuery.count().exec();
console.log({totalDocs})

 if(req.query._limit && req.query._page){
    // const skip = (req.query._page-1)*req.query._limit
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);
    query = query.skip(pageSize*(page-1)).limit(pageSize);
 }

    try{
        //to execute query we use exec method
        const docs = await query.exec();
        //set header in response
        res.set("X-Total-Count",totalDocs);
        res.status(200).json(docs);
    }catch(error){
        res.status(400).json(error);
    }
}


exports.fetchProductById=async(req,res)=>{
    const {id} = req.params;
    try{
        const product = await Product.findById(id);
        res.status(201).json(product);
    }catch(error){
        res.status(400).json(error);
    }
}

exports.updateProduct=async(req,res)=>{
    const {id} = req.params;
    try{
        const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
        res.status(201).json(product);
    }catch(error){
        res.status(400).json(error);
    }
}