const { User } = require("../model/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
//signup
exports.createUser = async (req, res) => {
    try {
        console.log("req.user",req)
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(req.body.password, salt);
      
      const user = new User({
        email: req.body.email,
        password: req.body.password,
      });      
      const doc = await user.save();
      
      const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
      
      res.cookie('jwt', token, {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'none', 
        secure: true 
      });
      
    //   res.status(201).json({ id: doc.id, role: doc.role });
    res.status(201).json({
        id: doc.id,
        email: doc.email,
        role: doc.role,
        token
      });
    } catch (err) {
      res.status(400).json(err);
    }
  };

//   exports.loginUser = async (req, res) => {
//     console.log("login user:",req.user)
//     const user = req.user;
//     res.cookie("jwt", req.user.token, {
//         expires: new Date(Date.now() +  60*60*1000), //for one hour
//         httpOnly: true
//     })
//     .status(201)
//     .json({id:user.id,role:user.role});
// }
  
  exports.loginUser = async (req, res) => {
    try {
        console.log("login req.body:",req.body)
      const user = await User.findOne({ email: req.body.email,password:req.body.password });
      console.log("user found:",user)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    console.log("hyyy")
    //   const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    //   console.log("isvalidpassword:",isValidPassword);
    //   if (!isValidPassword) {
    //     return res.status(401).json({ message: 'Invalid credentials' });
    //   }
  
      const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
      console.log("token login:",token);

      res.cookie('jwt', token, {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'none', 
        secure: true 
      });
    // res.cookie('jwt', token, {
    //     httpOnly: true, 
    //     maxAge: 24 * 60 * 60 * 1000, 
    //     sameSite: 'lax', 
    //     secure: false 
    //   });
    //   console.log('Response headers:', res.getHeaders()); // Debug log

      
    //   res.json({ id: user.id, role: user.role });
    res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token
      });
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  exports.checkAuth = async (req, res) => {
    console.log("checkauth:",req.user)
    if (req.user) {
      res.json(req.user);
    } else {
      res.sendStatus(401);
    }
  };