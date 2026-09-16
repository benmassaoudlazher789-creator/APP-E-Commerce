import React from 'react';
import { Link } from 'react-router-dom';

// utilise "to" pour une route interne (navigation client react-router) ou
// "href" pour un lien externe/ancre - meme rendu/animation dans les deux cas
export default function AnimatedLink({ href, to, children }) {
    const content = (
        <>
            {/* text */}
            <span className="text-gray-700 hover:text-[#E63946] transition-colors duration-300">
                {children}
            </span>

            {/* Soulignement animé */}
            <span
                className="absolute left-0 bottom-0 h-[2px] w-full bg-[#E63946]"
                style={{
                    transform: 'scaleX(0)',
                    transformOrigin: 'right',
                    transition: 'transform 0.3s ease',
                }}
            />
            {/* CSS pour animer au survol */}
            <style>{`
        .group:hover span {
          transform: scaleX(1) !important;
          transformOrigin: left !important;
        }
      `}</style>
        </>
    );

    if (to) {
        return (
            <Link to={to} className="group relative inline-block" style={{ textDecoration: 'none' }}>
                {content}
            </Link>
        );
    }

    return (
        <a href={href} className="group relative inline-block" style={{ textDecoration: 'none' }}>
            {content}
        </a>
    );
}
