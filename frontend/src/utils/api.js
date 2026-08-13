export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1980";

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { authorization: token } : {};
};
