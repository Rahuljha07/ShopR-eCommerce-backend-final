//controller
const {Category} = require("../model/Category");
exports.fetchCategories=async(req,res)=>{
    try{
        const categories = await Category.find({}); 
        res.status(200).json(categories);
    }catch(err){
        // 400 for bad request
        res.status(400).json(err);
    }
}

exports.createCategory=async(req,res)=>{
    try{
        const category = new Category(req.body);
        const doc = await category.save();
        res.status(201).json(doc);
    }catch(error){
        res.status(400).json(error);
    }
}



