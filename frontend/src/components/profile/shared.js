// classes Tailwind partagees entre les sous-composants du profil, pour eviter
// que chaque formulaire redefinisse son propre style de champ/message.
export const FIELD_INPUT_CLASS =
    "rounded-lg border border-neutral-300 px-3 py-2 text-sm font-normal text-neutral-900 focus:border-[#e63946] focus:outline-none focus:ring-2 focus:ring-[#e63946]/20";

export const messageClass = (type) =>
    `rounded-lg px-3 py-2 text-sm ${type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-[#c1121f]"}`;
