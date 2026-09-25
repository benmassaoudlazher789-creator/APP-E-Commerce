const cloudinary = require("./cloudinary");

//extrait le public_id cloudinary d'une secure_url pour pouvoir la supprimer
//(l'app ne stocke que l'URL, pas le public_id, contrairement a User.cloudinary_id)
const publicIdFromUrl = (url) => {
    const match = url?.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match?.[1];
};

//supprime les images (principale + galerie) d'un produit sur Cloudinary - au mieux :
//une erreur cote Cloudinary ne doit pas bloquer la suppression du produit
const destroyProductImages = (product) => {
    const urls = [product.imageProd, ...(product.images || [])].filter(Boolean);
    return Promise.all(
        urls.map((url) => {
            const publicId = publicIdFromUrl(url);
            return publicId ? cloudinary.uploader.destroy(publicId).catch(() => {}) : Promise.resolve();
        })
    );
};

module.exports = { destroyProductImages };
