import { useState } from "react";
import { motion } from "framer-motion";
import { validateShipping } from "../../utils/validators";

function ShippingStep({ initialData, onNext }) {
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => setData({ ...data, [field]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateShipping(data);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) onNext(data);
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="checkout-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <h3>Shipping Information</h3>

            <label>
                Full Name
                <input value={data.fullName} onChange={handleChange("fullName")} />
                {errors.fullName && <span className="checkout-form__error">{errors.fullName}</span>}
            </label>

            <label>
                Address
                <input value={data.address} onChange={handleChange("address")} />
                {errors.address && <span className="checkout-form__error">{errors.address}</span>}
            </label>

            <div className="checkout-form__row">
                <label>
                    City
                    <input value={data.city} onChange={handleChange("city")} />
                    {errors.city && <span className="checkout-form__error">{errors.city}</span>}
                </label>
                <label>
                    Postal Code
                    <input value={data.postalCode} onChange={handleChange("postalCode")} />
                    {errors.postalCode && (
                        <span className="checkout-form__error">{errors.postalCode}</span>
                    )}
                </label>
            </div>

            <label>
                Phone
                <input value={data.phone} onChange={handleChange("phone")} placeholder="+216 00 000 000" />
                {errors.phone && <span className="checkout-form__error">{errors.phone}</span>}
            </label>

            <button type="submit" className="btn-primary checkout-form__submit">
                Continue to Payment
            </button>
        </motion.form>
    );
}

export default ShippingStep;
