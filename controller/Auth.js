const { User } = require("../model/User");

//signup
exports.createUser=async(req,res)=>{
    //  TOdo : need to encrypt the password
    try{
        const user = new User(req.body);
        const doc = await user.save();
        res.status(201).json(doc);
    }catch(error){
        res.status(400).json(error);
    }
}


//login
exports.loginUser=async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(400).json({call:false,message:"Invalid email"});
        }
        else if(user.password===req.body.password){
            res.status(201).json({call:true,id:user.id,email:user.email,name:user.name,addresses:user.addresses});
        }else{
            res.status(400).json({call:false,message:"Invalid Credentials"});
        }
    }catch(error){
        res.status(400).json(error);
    }
}