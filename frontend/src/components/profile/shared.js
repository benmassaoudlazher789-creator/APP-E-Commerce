// classes partagees entre les sous-composants du profil : reutilise les
// classes utilitaires globales de shared.css (deja importe via index.css)
// plutot que Tailwind, qui n'est pas branche dans ce projet (pas de
// directive @tailwind, voir postcss.config.js).
export const FIELD_INPUT_CLASS = "form-input";

export const messageClass = (type) => `form-message form-message--${type}`;
