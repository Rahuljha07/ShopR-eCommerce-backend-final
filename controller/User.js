const { User } = require('../model/User');

exports.fetchUserById = async (req, res) => {
  console.log("fetchuserbyid:",req.user);
  const { id } = req.user;
  try {
    //second part is called projections
    const user = await User.findById(id);

    res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
  } catch (err) {
    res.status(400).json(err);
  }
};

// exports.createUser=async(req,res)=>{
//     try{
//         const user = new User(req.body);
//         const doc = await user.save();
//         res.status(201).json(doc);
//     }catch(error){
//         res.status(400).json(error);
//     }
// }

exports.updateUser = async (req, res) => {
  // const { id } = req.params;
    const { id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};