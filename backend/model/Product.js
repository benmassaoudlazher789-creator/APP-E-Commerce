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
    //prix avant reduction, affiche barre a cote de price sur la page Sale
    originalPrice :{
        type : Number,
    },
    //pourcentage de reduction affiche sur le badge produit (ex: 25 -> "-25%")
    discountPercentage :{
        type : Number,
        min : 0,
        max : 100,
    },
    //true pour faire apparaitre le produit dans /api/product/allProd?onSale=true
    isOnSale :{
        type : Boolean,
        default : false,
    },
    //point focal optionnel de imageProd pour les miniatures recadrees (panier...) : x/y en %
    //de l'image, zoom >= 1. Utile quand la photo est une mise en scene (ballon, decor) et que
    //le recadrage centre par defaut ne montre pas assez la chaussure. Absent = centre, sans zoom.
    imageFocus :{
        x : { type : Number, min : 0, max : 100 },
        y : { type : Number, min : 0, max : 100 },
        zoom : { type : Number, min : 1, max : 3 },
    },

},

{ timestamps : true },
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;