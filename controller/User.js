const { User } = require('../model/User');

exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    //second part is called projections
    const user = await User.findById(id,"name email id ");
    res.status(200).json(user);
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
  const { id } = req.params;
  console.log(req.params)
  console.log(req.body)
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};