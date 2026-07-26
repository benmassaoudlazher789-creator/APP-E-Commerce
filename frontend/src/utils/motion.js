// Tokens d'animation partages : une seule source pour les easings/springs
// utilises par PageTransition, Reveal, ProductGrid et ProductCard, pour que
// les transitions entre composants aient la meme sensation partout sur le site.

// easeOutQuint : meme courbe que les transitions de page, fluide et rapide en fin de course
export const EASE_SMOOTH = [0.22, 1, 0.36, 1];

export const SPRING = { type: "spring", duration: 0.25, bounce: 0.1 };
export const SPRING_BOUNCY = { type: "spring", duration: 0.3, bounce: 0.2 };
