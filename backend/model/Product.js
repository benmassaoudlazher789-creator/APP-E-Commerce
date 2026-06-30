const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({

    title: {

     type: String,
     require: true,
     trim: true,
    },
    description : {

        type: String,
        require: true,
        trim: true,
    },
    price :{
     type : Number,
     require : true
    },
    imageProd :{
        type : String,

    },
    //pour faire relation entre collection User et product 
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    },

},

{ timestamps : true },
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;