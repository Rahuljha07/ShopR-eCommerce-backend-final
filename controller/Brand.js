//controller
const {Brand} = require("../model/Brand");
exports.fetchBrands=async(req,res)=>{
    try{
        const brands = await Brand.find({}); 
        res.status(200).json(brands);
    }catch(err){
        // 400 for bad request
        res.status(400).json(err);
    }
}


exports.createBrand=async(req,res)=>{
    try{
        const brand = new Brand(req.body);
        const doc = await brand.save();
        res.status(201).json(doc);
    }catch(error){
        res.status(400).json(error);
    }
}



