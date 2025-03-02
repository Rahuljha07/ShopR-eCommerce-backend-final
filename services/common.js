// const passport  = require("passport");
const jwt = require("jsonwebtoken");

// Fix the isAuth middleware function
exports.isAuth = () => {
  return (req, res, next) => {
    console.log('Incoming request cookies:', req.cookies); // Debug log

    const token = req.cookies.jwt;
    console.log("token isauth:",token)
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};


exports.sanitizeUser = (user) =>{
  console.log("user sani:",user)
    return {id:user.id,role:user.role};
}

exports.cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  //todo : this is temporary token for testing
 //test token  
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWFkNTM3MzQyNDJjMjcwN2ZmNzgwYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzNjI5NzI3fQ.8b9HCwJEeNgKDhyOxwcUt7OzcP5vxF3GyJyU-ouunWM'
  //admin token
//  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjJkN2YzYjYxOTM1ZDdmZjZiZTU5YyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzNjM2NzgyfQ.k25peCoQzUpIRPEpy66-xRUWN4kMs5X27vvev_x_vGM'
  return token;
};