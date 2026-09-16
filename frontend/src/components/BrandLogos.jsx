import "./BrandLogos.css";

const BRANDS = [
    {
        name: "Nike",
        color: "#111111",
        icon: (
            <svg className="brand-logos__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M24 7.8 6.442 15.276c-1.456.616-2.679 1.262-3.709 1.938C1.703 18.889 1 20.127 1 21.5c0 .828.672 1.5 1.5 1.5.379 0 .742-.142 1.019-.4C5.143 19.113 8.537 16.859 12.692 14.875 17.848 12.892 21.151 11.032 24 9.2V7.8z"
                />
            </svg>
        ),
    },
    {
        name: "Adidas",
        color: "#000000",
        icon: (
            <svg className="brand-logos__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M1.512 18.012h21.976L12 5.012 1.512 18.012zm3.86-2.012L12 9.012l6.628 6.988H5.372z"
                />
            </svg>
        ),
    },
    {
        name: "Jordan",
        color: "#CE1141",
        icon: (
            <svg className="brand-logos__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M12.014 1.5c-2.52 0-4.56 2.04-4.56 4.56 0 1.08.378 2.07 1.008 2.85-.63.72-1.008 1.71-1.008 2.79 0 2.22 1.8 4.02 4.02 4.02.54 0 1.05-.108 1.518-.3.468.192.978.3 1.518.3 2.22 0 4.02-1.8 4.02-4.02 0-1.08-.378-2.07-1.008-2.79.63-.78 1.008-1.77 1.008-2.85 0-2.52-2.04-4.56-4.56-4.56zm-.014 1.8a2.76 2.76 0 0 1 2.76 2.76c0 .72-.276 1.374-.726 1.866l-.534.558.534.558c.45.492.726 1.146.726 1.866a2.76 2.76 0 0 1-2.76 2.76 2.76 2.76 0 0 1-2.76-2.76c0-.72.276-1.374.726-1.866l.534-.558-.534-.558a2.742 2.742 0 0 1-.726-1.866 2.76 2.76 0 0 1 2.76-2.76zm-3.6 9.72c-.99 0-1.8.81-1.8 1.8s.81 1.8 1.8 1.8 1.8-.81 1.8-1.8-.81-1.8-1.8-1.8zm7.2 0c-.99 0-1.8.81-1.8 1.8s.81 1.8 1.8 1.8 1.8-.81 1.8-1.8-.81-1.8-1.8-1.8z"
                />
            </svg>
        ),
    },
    {
        name: "Puma",
        color: "#000000",
        icon: (
            <svg className="brand-logos__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M15.184 2.016c-2.832 0-5.136 2.304-5.136 5.136 0 .936.252 1.812.696 2.568-1.44 1.008-2.376 2.664-2.376 4.536 0 3.096 2.52 5.616 5.616 5.616 1.512 0 2.88-.6 3.888-1.572.408.36.936.564 1.512.564 1.248 0 2.256-1.008 2.256-2.256 0-.672-.288-1.272-.744-1.692.456-.42.744-1.02.744-1.692 0-1.248-1.008-2.256-2.256-2.256-.576 0-1.104.204-1.512.564C18.24 3.612 16.872 3.012 15.36 3.012c-.408 0-.792.072-1.176.204V2.016zm-3.048 8.4c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3z"
                />
            </svg>
        ),
    },
    {
        name: "New Balance",
        color: "#CF0A2C",
        icon: (
            <svg className="brand-logos__icon" viewBox="0 0 80 24" aria-hidden="true">
                <text
                    x="0"
                    y="18"
                    fill="currentColor"
                    fontSize="16"
                    fontWeight="800"
                    fontFamily="Inter, system-ui, sans-serif"
                    letterSpacing="-0.04em"
                >
                    NB
                </text>
            </svg>
        ),
    },
    {
        name: "Reebok",
        color: "#E41D1B",
        icon: (
            <svg className="brand-logos__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M12 2 2 20h6.5l3.5-6 3.5 6H22L12 2zm0 5.8L16.2 18h-8.4L12 7.8z"
                />
            </svg>
        ),
    },
];

function BrandLogos() {
    return (
        <section className="brand-logos" aria-label="Partner brands">
            <ul className="brand-logos__list">
                {BRANDS.map((brand) => (
                    <li
                        key={brand.name}
                        className="brand-logos__item"
                        style={{ "--brand-color": brand.color }}
                        title={brand.name}
                        aria-label={brand.name}
                    >
                        {brand.icon}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default BrandLogos;
