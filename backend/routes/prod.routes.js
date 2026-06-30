const express = require("express")
const { addProduct, getAllProd, getOneProd, getMyProd, updateMyProd, deleteProd} = require("../controller/product.controller")
const isAuth = require("../middlewares/isAuth")



const router = express.Router()


// route test
//router.get('/test', (req,res)=>{
//  res.status(200).json("hello products route")
//})

//add product 
   router.post ('/addProd', isAuth, addProduct) 
   //get all des produits
   router.get ('/allProd' , getAllProd) 
   //get one 
   router.get("/prod/:id" , getOneProd) 
   //get myProd
router.get("/myProd", isAuth, getMyProd) 
//update prod
router.put("/:id", isAuth, updateMyProd) 
//delete prod 
router.delete("/:id", isAuth, deleteProd) 




module.exports = router;