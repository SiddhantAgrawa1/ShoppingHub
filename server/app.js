const express = require('express');
var bodyParser = require('body-parser')
require('./db/conn');
require('dotenv').config()
const app = express();
// const PORT =  8000;
const {Signup, ProductList,Cart, Order} = require('./models/model');
app.use(express.json())
const bcryptjs = require('bcryptjs');
const auth = require('./middleware/auth');
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/data',async(req,res) => {
    const data = await ProductList.find()
    res.send({data:data});
})

app.get('/auth',auth,async(req,res)=>{
    // console.log("user firstname",req.user.firstname);
    res.status(200).send({msg : "Authentication suceessfull", name : req.user.firstname});
})

app.post('/cart',auth,async (req,res) => {
    const email = req.user.email;
    const response = await Cart.findOne({email:email});
    if(response){
        let cartlist = response.cartlist
        cartlist.push(req.body.product)
        const resp = await Cart.updateMany({email:email}, {$set : {cartlist:cartlist}});
    }else{
        const cartlist = [req.body.product];
        const temp = new Cart({email,cartlist})
        const resp = await temp.save();
    }
    res.status(200).send({msg : "Item added to the cart"});
})

app.get('/cart',auth,async(req,res) => {
    const email = req.user.email;
    const data = await Cart.findOne({email:email});
    res.status(200).send({data : data, status : 200})
})

app.post('/order',auth,async (req,res) => {
    const email = req.user.email;
    const response = await Order.findOne({email:email});
    if(response){
        let orderlist = response.orderlist
        orderlist.push(req.body.product)
        const resp = await Order.updateMany({email:email}, {$set : {orderlist:orderlist}});
    }else{
        const orderlist = [req.body.product];
        const temp = new Order({email,orderlist})
        const resp = await temp.save();
    }
    res.status(200).send({msg : "Item added to the cart"});
})

app.get('/order',auth,async(req,res) => {
    const email = req.user.email;
    const data = await Order.findOne({email:email});
    res.status(200).send({data : data, status : 200})
})


app.post("/signup",async (req,res) =>{
    const {firstname,lastname,email,password } = req.body;
    const checkUser = await Signup.find({email : email})
    if(checkUser.length > 0)
        return res.status(400).json({message : "User already exist", status : 402})

    const user = new Signup({firstname,lastname,email,password})
    const response = await user.save();
    const token =  await user.generateAuthToken();
    res.cookie('jwt',token,{
        expires : new Date(Date.now() + 3000000),
        httpOnly : true
    })

    if(response) return res.status(200).json({msg : "data send successfully", status : 200});
    else return res.status(400).json({msg : "Error",status : 400});
})


app.post("/signin",async(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const user = await Signup.findOne({email:email})
    if(user ? await bcryptjs.compare(password,user.password) : false){
        const token =  await user.generateAuthToken();
        res.cookie('jwt',token,{
            expires : new Date(Date.now() + 300000),
            httpOnly : true
        })
        // console.log("sign in successfull")
        req.userdata = user;
        return res.status(200).json({status:200, data : user});
    }else
        return res.status(400).json({status : 400});
})

app.get('/signout', auth,async (req,res) => {
    try{
        res.clearCookie("jwt");
        const email = req.user.email;
        const response = await Signup.findOne({email:email});
        response.tokens.pop();
        // console.log("logout",response)  
        const resp = await Signup.updateMany({email:email}, {$set : {tokens:response.tokens}});
        res.status(200).send({status : 200});
    }
    catch(error){
        res.status(404).send({status : 404})
    }
})

app.listen(process.env.PORT,() => {
    console.log(`Started on port ${process.env.PORT}`);
})