const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const SignUpSchema = new mongoose.Schema({
    firstname : {
        type : String,
        unique : false,
        minlength : 3,
        required : true
    },
    lastname : {
        type : String,
        unique : false,
        minlength : 2,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        unique : false,
        minlength : 8,
        required : true
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

const ProductSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    oprice : {
        type : Number,
        required : true
    },
    dprice : {
        type : Number,
        required : true
    },
    discount : {
        type : String,
        required : true
    },
    imgsrc : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
})

const CartSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    cartlist : {
        type : Array,
        required : true
    }
})

const OrderSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    orderlist : {
        type : Array,
        required : true
    }
})

SignUpSchema.pre("save",async function (next){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password,10);
    }
    next();    
})

SignUpSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},"SiddhantSanjayAgrawal");
        this.tokens = this.tokens.concat({token : token});
        await this.save();
        return token;
    }
    catch(error){
        console.log("The error part"+error);
    }
}

const Signup = new mongoose.model('Signup',SignUpSchema);

const ProductList = new mongoose.model("ProductList", ProductSchema);

const Cart = new mongoose.model("Cart",CartSchema);

const Order = new mongoose.model("Order",OrderSchema);

module.exports = {Signup, ProductList, Cart, Order};