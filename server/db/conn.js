require('dotenv').config()
const mongoose = require('mongoose');

// console.log(process.env.DB)
mongoose.connect(process.env.DB)
.then(() => {
    console.log("Connection to database is successfull");
})
.catch((error) => {
    console.log("Unable to connect to database",error);
})   
