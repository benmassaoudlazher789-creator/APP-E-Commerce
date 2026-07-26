import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/tailwind-scoped.css";



// Lifestyle photo: model + street scene, framed for the right side of the
// desktop layout (the left side is masked by the diagonal graphic panel).
const heroImageUrl =
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783103423/Gemini_Generated_Image_26u8jb26u8jb26u8_kfdv6j.png";

const TruckIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M2 7h11v9H2zM13 10h4l4 3.5V16h-8zM5.5 19.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM16.5 19.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
    </svg>
);

const PaymentsBadge = ({ className = "" }) => (
    <div className={`flex items-center gap-3 rounded-md bg-white/95 px-3 py-2 shadow-md ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 whitespace-nowrap">
            Trusted Payments
        </span>
        <div className="flex items-center gap-1.5">
            <span className="h-6 px-2 inline-flex items-center rounded border border-neutral-200 bg-white text-[10px] font-extrabold text-[#1a1f71]">
                VISA
            </span>
            <span className="relative h-6 w-9 inline-flex items-center justify-center rounded border border-neutral-200 bg-white">
                <i className="h-3.5 w-3.5 rounded-full bg-[#eb001b] -mr-1.5" />
                <i className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
            </span>
            <span className="h-6 px-2 inline-flex items-center rounded border border-neutral-200 bg-white text-[10px] font-extrabold text-[#003087]">
                PayPal
            </span>
        </div>
    </div>
);

const ShippingBadge = ({ className = "" }) => (
    <div className={`flex items-center gap-2 rounded-md bg-black/85 px-4 py-2.5 text-sm font-semibold tracking-wide text-white ${className}`}>
        <TruckIcon className="w-4 h-4 text-[#e63946] flex-shrink-0" />
        Fast &amp; Free Shipping
    </div>
);

const QuickLinks = () => (
    <nav className="flex items-center gap-4 text-sm" aria-label="Quick shop links">
        <Link
            to="/shop?gender=men"
            className="text-white/90 underline underline-offset-4 decoration-white/40 hover:decoration-white hover:text-white"
        >
            Men&apos;s Shoes
        </Link>
        <Link
            to="/shop?gender=women"
            className="text-white/90 underline underline-offset-4 decoration-white/40 hover:decoration-white hover:text-white"
        >
            Women&apos;s Shoes
        </Link>
        <Link
            to="/shop"
            className="text-white/90 underline underline-offset-4 decoration-white/40 hover:decoration-white hover:text-white"
        >
            Sale
        </Link>
    </nav>
);

const DesktopHero = () => (
    <div className="relative hidden lg:block w-full min-h-[760px] overflow-hidden bg-[#141010]">
        <div
            className="absolute inset-0 bg-cover bg-[position:70%_25%]"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#0c0808]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
       <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0c0808]/50 to-transparent" />

        {/* solid diagonal panel: the source photo has its own headline/buttons
            baked in on this side, so this must stay fully opaque or that
            duplicate text ghosts through */}
        <div className="absolute inset-0 [clip-path:polygon(0%_0%,62%_0%,52%_100%,0%_100%)] bg-gradient-to-br from-[#0c0808] via-[#7a0f18] to-[#e63946]" />
        <div className="absolute inset-0 [clip-path:polygon(0%_0%,62%_0%,52%_100%,0%_100%)] opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.4px)] [background-size:10px_10px]" />

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex h-full flex-col justify-center px-16 py-20 max-w-xl"
        >
            <p className="text-[#ff8a90] font-bold uppercase tracking-[0.15em] text-sm mb-3">
                New Season Drop
            </p>
    
 <h1 className="text-5xl font-bold leading-tight">
  <span className="text-white block">FIND YOUR</span>
  <span className="text-red-400 block">PERFECT STEP</span>
</h1>
        <p className="text-white/90">
  Discover the Latest in Footwear fashion & comfort.
</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                    to="/shop"
                    className="inline-block bg-[#c1121f] hover:bg-[#a10f1a] transition-colors text-white font-bold uppercase tracking-wide text-sm px-8 py-3.5 rounded shadow-lg shadow-black/30"
                >
                    Shop Now
                </Link>
                <QuickLinks />
            </div>
        </motion.div>

        <PaymentsBadge className="absolute left-6 bottom-6 z-10" />
        <ShippingBadge className="absolute right-6 bottom-6 z-10" />
    </div>
);

const StackedHero = () => (
    <div className="lg:hidden">
        <div className="relative bg-gradient-to-br from-[#0c0808] via-[#5a0c13] to-[#c1121f] px-6 py-12 md:px-10 md:py-16">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.4px)] [background-size:10px_10px]" />
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                <p className="text-[#ff8a90] font-bold uppercase tracking-[0.15em] text-xs md:text-sm mb-3">
                    New Season Drop
                </p>
                <h1 className="text-white font-black uppercase leading-[0.95] text-4xl md:text-5xl tracking-tight">
                    Find Your
                    <br />
                    <span className="text-[#ff5a63]">Perfect Step</span>
                </h1>
                <p className="mt-4 max-w-sm text-white/80 text-base md:text-lg">
                    Discover the Latest in Footwear fashion &amp; comfort.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Link
                        to="/shop"
                        className="inline-block bg-[#c1121f] hover:bg-[#a10f1a] transition-colors text-white font-bold uppercase tracking-wide text-sm px-8 py-3.5 rounded shadow-lg shadow-black/30"
                    >
                        Shop Now
                    </Link>
                    <QuickLinks />
                </div>

                <PaymentsBadge className="mt-8" />
            </motion.div>
        </div>

        <div
            className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden"
            style={{ backgroundImage: `url(${heroImageUrl})`, backgroundSize: "auto 130%", backgroundPosition: "85% 100%", backgroundRepeat: "no-repeat" }}
        >
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#0c0808]/40 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0c0808]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <ShippingBadge className="absolute right-4 bottom-4" />
        </div>
    </div>
);

const HeroPromo = () => (
    <section id="tw-hero" className="tw-scope">
        <DesktopHero />
        <StackedHero />
    </section>
);

export default HeroPromo;