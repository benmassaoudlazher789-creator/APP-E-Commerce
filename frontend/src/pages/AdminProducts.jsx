import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addProduct } from "../JS/actions/Prod.action";
import "./AdminProducts.css";

const GENDERS = ["men", "women", "kids"];

const initialForm = {
    title: "",
    description: "",
    price: "",
    brand: "",
    gender: "men",
    sizes: "",
    stock: "",
};

const AdminProducts = () => {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();

    const [form, setForm] = useState(initialForm);
    const [mainImage, setMainImage] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // { type: "success" | "error", text }

    if (!user) {
        return (
            <div className="admin-products admin-products--locked">
                <h1>Add a Product</h1>
                <p className="text-small home__muted">
                    You need to be logged in to add products.
                </p>
                <Link to="/login" className="btn-primary admin-products__login-btn">
                    Log In
                </Link>
            </div>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        const sizeList = form.sizes
            .split(",")
            .map((s) => Number(s.trim()))
            .filter((s) => Number.isFinite(s) && s > 0);

        if (sizeList.length === 0) {
            setMessage({ type: "error", text: "Enter at least one valid size (e.g. 38, 39, 40)." });
            return;
        }
        if (!mainImage) {
            setMessage({ type: "error", text: "A main product image is required." });
            return;
        }

        const stock = Number(form.stock) || 0;
        const sizes = sizeList.map((size) => ({ size, stock }));

        const formData = new FormData();
        formData.append("title", form.title.trim());
        formData.append("description", form.description.trim());
        formData.append("price", form.price);
        formData.append("brand", form.brand.trim());
        formData.append("gender", form.gender);
        formData.append("sizes", JSON.stringify(sizes));
        formData.append("imageProd", mainImage);
        extraImages.forEach((file) => formData.append("images", file));

        setSubmitting(true);
        const result = await dispatch(addProduct(formData));
        setSubmitting(false);

        if (result.success) {
            setMessage({ type: "success", text: `"${result.product.title}" was added successfully.` });
            setForm(initialForm);
            setMainImage(null);
            setExtraImages([]);
            e.target.reset();
        } else {
            setMessage({ type: "error", text: result.error });
        }
    };

    return (
        <div className="admin-products">
            <h1>Add a Product</h1>
            <p className="text-small home__muted admin-products__intro">
                Creates a product via the existing <code>POST /api/product/addProd</code> route.
            </p>

            <form className="admin-products__form" onSubmit={handleSubmit}>
                <label className="admin-products__field">
                    <span>Product name</span>
                    <input
                        className="form-input"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="admin-products__field">
                    <span>Description</span>
                    <textarea
                        className="form-input"
                        name="description"
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="admin-products__row">
                    <label className="admin-products__field">
                        <span>Price ($)</span>
                        <input
                            className="form-input"
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="admin-products__field">
                        <span>Brand</span>
                        <input
                            className="form-input"
                            type="text"
                            name="brand"
                            value={form.brand}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="admin-products__row">
                    <label className="admin-products__field">
                        <span>Category</span>
                        <select className="form-input" name="gender" value={form.gender} onChange={handleChange}>
                            {GENDERS.map((g) => (
                                <option key={g} value={g}>
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="admin-products__field">
                        <span>Stock quantity (per size)</span>
                        <input
                            className="form-input"
                            type="number"
                            name="stock"
                            min="0"
                            value={form.stock}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <label className="admin-products__field">
                    <span>Available sizes (comma-separated)</span>
                    <input
                        className="form-input"
                        type="text"
                        name="sizes"
                        placeholder="38, 39, 40, 41, 42"
                        value={form.sizes}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="admin-products__row">
                    <label className="admin-products__field">
                        <span>Main image</span>
                        <input
                            className="form-input"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => setMainImage(e.target.files[0] || null)}
                            required
                        />
                    </label>

                    <label className="admin-products__field">
                        <span>Additional images (up to 4)</span>
                        <input
                            className="form-input"
                            type="file"
                            accept="image/jpeg,image/png"
                            multiple
                            onChange={(e) => setExtraImages([...e.target.files].slice(0, 4))}
                        />
                    </label>
                </div>

                {message && (
                    <p className={`form-message form-message--${message.type}`}>
                        {message.text}
                    </p>
                )}

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Adding…" : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AdminProducts;
