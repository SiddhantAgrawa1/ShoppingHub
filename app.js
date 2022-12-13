const express = require('express');
const razorpay = require('razorpay')
const crypto = require('crypto')
var bodyParser = require('body-parser')
require('./db/conn');
require('dotenv').config()
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8000;
const {Signup, ProductList,Cart, Order} = require('./models/model');
app.use(express.json())
const bcryptjs = require('bcryptjs');
const auth = require('./middleware/auth');
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
const mongoose = require('mongoose');
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'./client/build')))

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}

  //Connect to the database before listening



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})

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

app.post('/orders',auth, async(req,res) => {
    try{
        req.product = req.body.product
        req.address = req.body.address
        const instances = new razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET,
        })
        
        const options = {
            amount : req.body.product['dprice'] * 100,
            currency:"INR",
            receipt : crypto.randomBytes(10).toString("hex")
        }
        const order = req.body.product;
        const email = req.user.email;
        const response = await Order.findOne({email:email});
        if(response){
            let orderlist = response.orderlist
            orderlist.push([req.product,req.address])
            const resp = await Order.updateMany({email:email}, {$set : {orderlist:orderlist}});
        }else{
            const orderlist = [[req.product,req.address]];
            const temp = new Order({email,orderlist})
            const resp = await temp.save();
        }
        instances.orders.create(options, (error,order) => {
            if(error){
                console.log(error)
                return res.status(400).json({status:400,message : "Something went wrong"})
            }   
            res.status(200).json({status : 200,data:order})
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({status:500, message : "Internal server Error!"})
    }
})

app.post('/verify', async(req,res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature  } = req.body
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex")
        console.log("verify")
        if(razorpay_signature === expectedSign){
            return res.status(200).json({message : "Payment Verified successfully"})
        }else{
            return res.status(400).json({message : "Invalid signature sent!"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }
})

app.post('/cancelorder',auth, async(req,res) => {
    try {
        const id = req.body.id;
        const response = await Order.findOne({email:req.user.email});
        const orderlist = await response.orderlist;
        const updatedList = orderlist.filter((order) => {
            if(order[0].id !== id) return order
        })
        console.log(updatedList)
        const updated = await Order.updateMany({email : req.user.email }, {$set : {orderlist : updatedList}})
        console.log(updated);
        res.status(200).send({msg:"Order cancelled",status : 200})    
    } catch (error) {
        res.status(500).send({msg:"Order cancelled"})    
    }
    
}) 
