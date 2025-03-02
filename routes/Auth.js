//Routers
const express = require("express");
const { createUser,loginUser,checkAuth } = require("../controller/Auth");

// const passport  = require("passport");
const router = express.Router();

router.post("/signup", createUser)
      .post("/login", loginUser)
      .get("/check", checkAuth)

exports.router = router;

