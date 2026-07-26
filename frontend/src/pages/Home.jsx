import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProducts } from "../JS/actions/Prod.action";
import ProductCarousel from "../components/ProductCarousel";
import Reveal from "../components/Reveal";
import HeroPromo from "../components/HeroPromo";
import "./Home.css";

const Home = () => {
    const dispatch = useDispatch();
    const { products, isLoad } = useSelector((state) => state.productReducer);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const newArrivals = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

    return (
        <div className="home">
            <HeroPromo />

            {/* New Arrivals */}
            <section className="section">
                <Reveal>
                    <div className="section__header">
                        <h2>New Arrivals</h2>
                        <Link to="/shop" className="section__link">
                            View all →
                        </Link>
                    </div>
                </Reveal>
                {isLoad ? (
                    <p className="text-small home__muted">Loading products…</p>
                ) : (
                    <ProductCarousel
                        products={newArrivals}
                        emptyMessage="No products yet — check back soon."
                    />
                )}
            </section>

            {/* Brand story */}
            <section className="brand-story">
                <Reveal className="brand-story__text">
                    <p className="hero__eyebrow text-small">Our Story</p>
                    <h2>Made for movement, built to last.</h2>
                    <p className="hero__subtitle">
                        Red Store started with a simple idea: sneakers should look sharp
                        and perform harder. Every pair we design goes through obsessive
                        testing so it holds up on the court, the street, and everywhere
                        in between.
                    </p>
                </Reveal>
                <Reveal delay={0.15} className="brand-story__stats">
                    <div className="brand-story__stat">
                        <h3>10K+</h3>
                        <p className="text-small">Happy Customers</p>
                    </div>
                    <div className="brand-story__stat">
                        <h3>50+</h3>
                        <p className="text-small">Shoe Models</p>
                    </div>
                    <div className="brand-story__stat">
                        <h3>4.8★</h3>
                        <p className="text-small">Average Rating</p>
                    </div>
                </Reveal>
            </section>
        </div>
    );
};

export default Home;
