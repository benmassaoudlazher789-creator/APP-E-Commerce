const Product = require("../model/Product")
const cloudinary = require("../util/cloudinary")

//upload l'image principale (champ "imageProd") et la galerie (champ "images") vers cloudinary
const uploadProductImages = async (files) => {
    const result = {};
    if (files?.imageProd?.[0]) {
        const uploaded = await cloudinary.uploader.upload(files.imageProd[0].path);
        result.imageProd = uploaded.secure_url;
    }
    if (files?.images?.length) {
        const uploaded = await Promise.all(
            files.images.map((file) => cloudinary.uploader.upload(file.path))
        );
        result.images = uploaded.map((img) => img.secure_url);
    }
    return result;
};

//les requetes multipart (upload de fichier) envoient "sizes" en JSON stringifie
const parseBody = (body) => {
    if (typeof body.sizes === "string") {
        try {
            return { ...body, sizes: JSON.parse(body.sizes) };
        } catch {
            return body;
        }
    }
    return body;
};

//add product
exports.addProduct = async (req, res) => {

    try {
        const uploaded = await uploadProductImages(req.files);
        //construction du document  produit
        const newProd = new Product({ ...parseBody(req.body), ...uploaded, createdBy: req.user._id })
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
        // filtre optionnel par genre / categorie (?gender=men&category=shoes)
        const filter = {};
        if (req.query.gender) filter.gender = req.query.gender;
        if (req.query.category) filter.category = req.query.category;
        const Prod = await Product.find(filter)
        res.status(200).json({ msg: "Products:", Prod })


    } catch (error) {

        res.status(500).json({ msg: "Fail to get products", error });
    }

};

//search : ?q=... filtre insensible a la casse sur titre/description/categorie/marque
exports.searchProd = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        if (!q) return res.status(200).json({ msg: "Products:", Prod: [] });

        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        const Prod = await Product.find({
            $or: [{ title: regex }, { description: regex }, { category: regex }, { brand: regex }],
        });
        res.status(200).json({ msg: "Products:", Prod });
    } catch (error) {
        res.status(500).json({ msg: "Fail to search products", error });
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
        const uploaded = await uploadProductImages(req.files);
        //mise a jour
        const prodToUpdate = await Product.findByIdAndUpdate(
            id,
            { ...parseBody(req.body), ...uploaded },
            { new: true },
        );
        res.status(200).json({ msg: "Updated", prodToUpdate });

    } catch (error) {

        res.status(500).json({ msg: "Fail to update this prod", error });

    }

};
//extrait le public_id cloudinary d'une secure_url pour pouvoir la supprimer
//(l'app ne stocke que l'URL, pas le public_id, contrairement a User.cloudinary_id)
const publicIdFromUrl = (url) => {
    const match = url?.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match?.[1];
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

        //supprime les images (principale + galerie) sur Cloudinary pour ne pas les laisser
        //orphelines - au mieux (une erreur cote Cloudinary ne doit pas bloquer la suppression
        //du produit, qui reste l'action principale demandee par l'utilisateur)
        const urls = [prodToFind.imageProd, ...(prodToFind.images || [])].filter(Boolean);
        await Promise.all(
            urls.map((url) => {
                const publicId = publicIdFromUrl(url);
                return publicId ? cloudinary.uploader.destroy(publicId).catch(() => {}) : Promise.resolve();
            })
        );

        await Product.findByIdAndDelete(id);
        res.status(200).json({ msg: "produit supprimé!", prodToFind });

    } catch (error) {

        res.status(500).json({ msg: "Fail to update this prod", error });

    }

};
