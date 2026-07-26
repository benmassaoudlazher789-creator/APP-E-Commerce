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
    //galerie d'images additionnelles
    images :{
        type : [String],
        default : [],
    },
    brand :{
        type : String,
        trim : true,
    },
    category :{
        type : String,
        trim : true,
        default : "shoes",
    },
    //pour filtrer Men / Women / Kids dans le catalogue
    gender :{
        type : String,
        enum : ["men", "women", "kids", "unisex"],
        default : "unisex",
    },
    //stock disponible par pointure
    sizes :{
        type : [
            {
                size : { type : Number, required : true },
                stock : { type : Number, required : true, default : 0 },
            },
        ],
        default : [],
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