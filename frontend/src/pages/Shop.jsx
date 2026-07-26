import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, searchProducts } from "../JS/actions/Prod.action";
import ProductGrid from "../components/ProductGrid";
import Reveal from "../components/Reveal";
import { formatPrice } from "../utils/format";
import { cn } from "../lib/utils";
import "../styles/tailwind-scoped.css";

const Shop = () => {
    const dispatch = useDispatch();
    const { products, isLoad } = useSelector((state) => state.productReducer);
    const [searchParams] = useSearchParams();
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const gender = searchParams.get("gender") || "";

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [maxPrice, setMaxPrice] = useState(null);

    useEffect(() => {
        if (query) dispatch(searchProducts(query));
        else dispatch(getAllProducts({ gender }));
    }, [dispatch, gender, query]);

    const brands = useMemo(
        () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
        [products]
    );
    const sizes = useMemo(
        () =>
            [...new Set(products.flatMap((p) => (p.sizes || []).map((s) => s.size)))].sort(
                (a, b) => a - b
            ),
        [products]
    );
    const priceCeiling = useMemo(
        () => Math.max(0, ...products.map((p) => p.price || 0)),
        [products]
    );

    // Derive plutot que synchroniser : si la categorie/recherche change et que le nouveau
    // catalogue a un prix max plus bas que maxPrice (etat brut, jamais reecrit ici), le clamp est
    // recalcule au meme rendu via priceCeiling (deja recalcule par le useMemo ci-dessus) - sans
    // ce clamp, l'attribut max du <input> passerait sous value, et le navigateur clamperait alors
    // silencieusement la position visuelle du curseur sans que React ne le sache, desynchronisant
    // le curseur du texte affiche et faussant le filtre.
    const clampedMaxPrice = maxPrice !== null ? Math.min(maxPrice, priceCeiling) : null;

    // Le curseur natif (peint par le navigateur, hors du cycle de rendu React) reste toujours
    // instantane et correct - c'est clampedMaxPrice qui l'alimente, jamais retarde. Mais re-rendre
    // toute la grille (cartes Framer Motion) sur CHAQUE evenement d'un vrai glisser-deposer rapide
    // est trop couteux et prend du retard sur le curseur : on ne voit alors que l'ancien
    // filtrage pendant une fraction de seconde, avant que la grille ne rattrape son retard. Seul
    // le filtre effectif (filterMaxPrice) est donc debounce, jamais l'affichage du curseur/texte.
    const [filterMaxPrice, setFilterMaxPrice] = useState(clampedMaxPrice);
    useEffect(() => {
        const timer = setTimeout(() => setFilterMaxPrice(clampedMaxPrice), 120);
        return () => clearTimeout(timer);
    }, [clampedMaxPrice]);

    const toggle = (list, setList, value) =>
        setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

    // Memoise sur filterMaxPrice (deja debounce), pas sur maxPrice/clampedMaxPrice qui changent a
    // chaque tick du drag : sans ce useMemo, .filter() renvoie un NOUVEAU tableau a chaque render
    // (meme quand son contenu ne change pas), donc ProductGrid (non memoise) refait toute sa
    // reconciliation Framer Motion sur chaque evenement du drag et bloque le thread principal -
    // c'est ce qui fait paraitre le curseur natif saccade pendant le glissement.
    const filtered = useMemo(
        () =>
            products.filter((p) => {
                if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
                if (selectedSizes.length && !(p.sizes || []).some((s) => selectedSizes.includes(s.size)))
                    return false;
                if (filterMaxPrice !== null && p.price > filterMaxPrice) return false;
                return true;
            }),
        [products, selectedBrands, selectedSizes, filterMaxPrice]
    );

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedBrands([]);
        setMaxPrice(null);
        setFilterMaxPrice(null);
    };

    const genderLabel = { men: "Men's Shoes", women: "Women's Shoes", kids: "Kids' Shoes" }[gender];
    const pageTitle = query
        ? `Results for "${searchParams.get("q")}"`
        : genderLabel || "Shop All Shoes";
    const hasCatalog = products.length > 0;

    return (
        <div className="tw-scope">
            <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
                <Reveal>
                    <div className="mb-6 flex items-baseline justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{pageTitle}</h1>
                        {!isLoad && hasCatalog && (
                            <p className="text-sm text-neutral-500">
                                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                </Reveal>

                {isLoad ? (
                    <p className="py-24 text-center text-sm text-neutral-500">Loading products…</p>
                ) : !hasCatalog ? (
                    <div className="py-24 text-center">
                        <p className="text-sm text-neutral-500">
                            {genderLabel
                                ? `No ${genderLabel.toLowerCase()} available yet — check back soon.`
                                : "No products in the store yet — check back soon."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[240px_1fr] items-start gap-8 max-lg:grid-cols-1">
                        <aside className="sticky top-24 flex flex-col gap-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 max-lg:static">
                            {brands.length > 0 && (
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-neutral-900">Brand</h4>
                                    <div className="flex flex-col gap-1">
                                        {brands.map((brand) => (
                                            <label
                                                key={brand}
                                                className="flex cursor-pointer items-center gap-2 py-1 text-sm text-neutral-700"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 cursor-pointer accent-[#e63946]"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => toggle(selectedBrands, setSelectedBrands, brand)}
                                                />
                                                {brand}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizes.length > 0 && (
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-neutral-900">Size</h4>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggle(selectedSizes, setSelectedSizes, size)}
                                                className={cn(
                                                    "rounded-lg border py-1.5 text-sm font-medium transition-colors",
                                                    selectedSizes.includes(size)
                                                        ? "border-[#e63946] bg-[#e63946] text-white"
                                                        : "border-neutral-300 bg-white text-neutral-700 hover:border-[#e63946] hover:text-[#e63946]"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {priceCeiling > 0 && (
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-neutral-900">Max Price</h4>
                                    <input
                                        type="range"
                                        min="0"
                                        max={priceCeiling}
                                        value={clampedMaxPrice ?? priceCeiling}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="h-1.5 w-full cursor-pointer accent-[#e63946]"
                                    />
                                    <p className="mt-1 text-sm text-neutral-600">
                                        Up to {formatPrice(clampedMaxPrice ?? priceCeiling)}
                                    </p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg border border-neutral-300 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
                            >
                                Clear Filters
                            </button>
                        </aside>

                        <div>
                            <ProductGrid products={filtered} emptyMessage="No shoes match these filters." />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
