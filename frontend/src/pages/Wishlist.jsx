import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist } from "../JS/actions/wishlist.action";
import ProductGrid from "../components/ProductGrid";
import Reveal from "../components/Reveal";
import "../styles/tailwind-scoped.css";

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.authReducer.user);
    const { items, isLoad } = useSelector((state) => state.wishlistReducer);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        dispatch(getWishlist());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, navigate]);

    if (!user) return null;

    return (
        <div className="tw-scope">
            <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
                <Reveal>
                    <div className="mb-6 flex items-baseline justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">My Wishlist</h1>
                        {!isLoad && items.length > 0 && (
                            <p className="text-sm text-neutral-500">
                                {items.length} product{items.length !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                </Reveal>

                {isLoad ? (
                    <p className="py-24 text-center text-sm text-neutral-500">Loading wishlist…</p>
                ) : items.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="mb-4 text-sm text-neutral-500">
                            You haven&apos;t saved any shoes yet.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block rounded-lg bg-[#e63946] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#c1121f]"
                        >
                            Browse the shop
                        </Link>
                    </div>
                ) : (
                    <ProductGrid products={items} emptyMessage="You haven't saved any shoes yet." />
                )}
            </div>
        </div>
    );
};

export default Wishlist;
