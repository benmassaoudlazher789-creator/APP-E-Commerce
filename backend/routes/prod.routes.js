const express = require("express")
const { addProduct, getAllProd, searchProd, getOneProd, getMyProd, updateMyProd, deleteProd} = require("../controller/product.controller")
const isAuth = require("../middlewares/isAuth")
const upload = require("../util/multer")

//accepte une image principale (imageProd) et jusqu'a 5 images de galerie (images)
const productImages = upload.fields([
    { name: "imageProd", maxCount: 1 },
    { name: "images", maxCount: 5 },
]);

const router = express.Router()


// route test
//router.get('/test', (req,res)=>{
//  res.status(200).json("hello products route")
//})

//add product
   router.post ('/addProd', isAuth, productImages, addProduct)
   //get all des produits
   router.get ('/allProd' , getAllProd)
   //recherche full-text (titre/description/categorie/marque)
   router.get ('/search' , searchProd)
   //get one
   router.get("/prod/:id" , getOneProd)
   //get myProd
router.get("/myProd", isAuth, getMyProd)
//update prod
router.put("/:id", isAuth, productImages, updateMyProd)
//delete prod
router.delete("/:id", isAuth, deleteProd)




module.exports = router;