export const validateShipping = (data) => {
    const errors = {};
    if (!data.fullName?.trim()) errors.fullName = "Full name is required";
    if (!data.address?.trim()) errors.address = "Address is required";
    if (!data.city?.trim()) errors.city = "City is required";
    if (!data.postalCode?.trim()) errors.postalCode = "Postal code is required";
    if (!data.phone?.trim()) errors.phone = "Phone number is required";
    else if (!/^[+]?[\d\s-]{7,}$/.test(data.phone.trim())) errors.phone = "Enter a valid phone number";
    return errors;
};

export const validateRegister = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Full name is required";
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Enter a valid email";
    if (!data.password) errors.password = "Password is required";
    else if (data.password.length < 6 || data.password.length > 32)
        errors.password = "Password must be between 6 and 32 characters";
    return errors;
};

export const validateLogin = (data) => {
    const errors = {};
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Enter a valid email";
    if (!data.password) errors.password = "Password is required";
    return errors;
};

export const validateContact = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Name is required";
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Enter a valid email";
    if (!data.subject?.trim()) errors.subject = "Subject is required";
    if (!data.message?.trim()) errors.message = "Message is required";
    else if (data.message.trim().length < 10) errors.message = "Message should be at least 10 characters";
    return errors;
};

export const validateCard = (data) => {
    const errors = {};
    const digits = data.cardNumber?.replace(/\s/g, "") || "";
    if (!/^\d{13,19}$/.test(digits)) errors.cardNumber = "Enter a valid card number";

    if (!/^\d{2}\/\d{2}$/.test(data.expiry || "")) {
        errors.expiry = "Use MM/YY format";
    } else {
        const [month, year] = data.expiry.split("/").map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (month < 1 || month > 12) errors.expiry = "Invalid month";
        else if (year < currentYear || (year === currentYear && month < currentMonth))
            errors.expiry = "Card has expired";
    }

    if (!/^\d{3,4}$/.test(data.cvv || "")) errors.cvv = "Enter a valid CVV";
    return errors;
};
