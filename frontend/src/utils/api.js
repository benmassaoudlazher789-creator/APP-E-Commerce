// URL de base de l'API : vide par défaut pour des appels relatifs (/api/...), servis par le proxy
// Vite en dev et par Nginx en Docker. VITE_API_URL ne sert que si l'API est sur une autre origine.
export const API_URL = import.meta.env.VITE_API_URL || "";

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { authorization: token } : {};
};
