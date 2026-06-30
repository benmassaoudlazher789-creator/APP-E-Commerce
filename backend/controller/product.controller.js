const Product = require("../model/Product")



//add product 
exports.addProduct = async (req, res) => {

    try {
        //construction du document  produit 
        const newProd = new Product({ ...req.body, createdBy: req.user._id })
        //sauvegarde dans le BD 
        await newProd.save()
        res.status(201).json({ msg: "product created successfully", newProd })

    } catch (error) {

        res.status(500).json({ msg: "Fail to add this product", error });
    }

};
// getAll
exports.getAllProd = async (req, res) => {

    try {
        // voir tout les produits 
        const Prod = await Product.find()
        res.status(200).json({ msg: "Products:", Prod })


    } catch (error) {

        res.status(500).json({ msg: "Fail to get products", error });
    }

};

//getOne
exports.getOneProd = async (req, res) => {

    try {
        const { id } = req.params;
        const prodToGet = await Product.findById(id)
        if (!prodToGet) return res.status(404).json({ msg: 'Product not found' })
        res.status(200).json({ msg: "The product is:", prodToGet })


    } catch (error) {

        res.status(500).json({ msg: "Fail to get this prod", error });
    }

};
// getmyprod
exports.getMyProd = async (req, res) => {
    try {
        const myListProd = await Product.find({ createdBy: req.user._id });
        res.status(200).json({ msg: "your product is:", myListProd });

    } catch (error) {

        res.status(500).json({ msg: "Fail to get your prod", error });
    }

}
//update my product 
exports.updateMyProd = async (req, res) => {
    try {
        // recuperer id a partir de la requete 
        const { id } = req.params;
        //chercher le produit dans ma collection 
        const foundProd = await Product.findById(id);
        if (!foundProd) return res.status(404).json({ msg: "Product not found" });
        if (foundProd.createdBy.toString() !== req.user._id.toString())
            return res.status(403).json({ msg: "you can't update this prod" });
        //mise a jour 
        const prodToUpdate = await Product.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true },
        );
        res.status(200).json({ msg: "Updated", prodToUpdate });

    } catch (error) {

        res.status(500).json({ msg: "Fail to update this prod", error });

    }

};
//delete
exports.deleteProd = async (req, res) => {
    try {
        // recuperer id a partir de la requete 
        const { id } = req.params;
        //chercher le produit dans ma collection 
        const prodToFind = await Product.findById(id);
        if (!prodToFind) return res.status(404).json({ msg: "Product not found" });
        if (prodToFind.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "tu n'a pas le droit de supprimer ce produit!" });
        }
        //mise a jour 
        const prodToUpdate = await Product.findByIdAndDelete(
            id,
            { ...req.body },
            { new: true },
        );
        res.status(200).json({ msg: "produit supprimé!", prodToFind }); 

    } catch (error) {

        res.status(500).json({ msg: "Fail to update this prod", error });

    }

};
