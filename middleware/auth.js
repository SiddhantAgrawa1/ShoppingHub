const jwt = require('jsonwebtoken')
const {Signup} = require('../models/model')

const auth = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        // console.log("token ",token)
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        // console.log("verifyuser ",verifyUser);
        const user = await Signup.findOne({_id:verifyUser._id});
        // console.log("user",user)
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send({error : "error"});
    }

}

module.exports = auth;