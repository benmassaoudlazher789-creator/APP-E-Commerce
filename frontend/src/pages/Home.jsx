import React from 'react';
import './Home.css'; 
import { motion } from 'framer-motion';     

const Hero = () => {
    return (
        <section className="hero-section">

            {/* Partie Gauche : Le Texte */}
            <div className="hero-content">
                <h1 className="hero-title">
                    Step Up Your Game <br /> With Red Store!
                </h1>
                <p className="hero-description">
                    Discover the latest collection of premium sneakers. Engineered for style and built for performance.
                </p>
                <button className="hero-btn">
                    Shop Now &rarr;
                </button>
            </div>

            {/* Partie Droite : L'image de la sneaker */}
            <div className="hero-image-container">
               <motion.img
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    src="https://res.cloudinary.com/dvvekltxc/image/upload/v1786474418/Screenshot_2026-08-11_195026_cdfkwh.png"
    alt="Red Sneaker"
    className="hero-image"
/>
            </div>

        </section>
    );
};

export default Hero;