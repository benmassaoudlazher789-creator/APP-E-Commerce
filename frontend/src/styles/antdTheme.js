// Theme Ant Design aligne sur les variables de theme.css, pour que les composants antd
// (Cart, ForgotPassword, ResetPassword...) gardent le rouge et la typo de Red Store.
// Les valeurs sont recopiees (et non lues via var(--...)) car antd derive ses
// couleurs de survol/actives a partir de ces hex au moment du calcul du theme.
const RED_STORE_PRIMARY = "#e63946"; // --color-primary
const RED_STORE_PRIMARY_DARK = "#c1121f"; // --color-primary-dark

export const antdTheme = {
    token: {
        colorPrimary: RED_STORE_PRIMARY,
        colorLink: RED_STORE_PRIMARY,
        colorText: "#1d1d1d", // --color-text
        colorTextSecondary: "#6c757d", // --color-text-secondary
        colorBorder: "#e5e5e5", // --color-border
        colorBorderSecondary: "#e5e5e5",
        colorSuccess: "#2a9d8f", // --color-success
        colorError: "#d62828", // --color-error
        // police reellement rendue sur le site (index.css : body/titres en Poppins)
        fontFamily: "'Poppins', sans-serif",
        borderRadius: 8, // --radius
    },
    components: {
        // un bouton "danger" (ex. Proceed to Checkout) reste dans le rouge de la marque,
        // pas dans le rouge d'erreur (--color-error) utilise pour les messages
        Button: {
            colorError: RED_STORE_PRIMARY,
            colorErrorHover: RED_STORE_PRIMARY_DARK,
            colorErrorActive: RED_STORE_PRIMARY_DARK,
            primaryShadow: "0 4px 12px rgba(230, 57, 70, 0.25)",
            dangerShadow: "0 4px 12px rgba(230, 57, 70, 0.25)",
        },
    },
};
