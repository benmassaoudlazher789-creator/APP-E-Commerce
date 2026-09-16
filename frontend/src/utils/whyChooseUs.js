// Source unique pour la section "Why Choose Us" (WhyChooseUsSection.jsx),
// partagee entre About.jsx et la Home pour ne jamais diverger sur le contenu.
import { Layers, Truck, ShieldCheck, Headphones } from 'lucide-react';

export const WHY_CHOOSE_US = [
    {
        icon: Layers,
        title: 'Multi-Brand Selection',
        description:
            'Nike, Adidas, Clarks, Timberland, Birkenstock and more — formal, casual, boots, sandals and sport, all under one roof.',
    },
    {
        icon: Truck,
        title: 'Fast, Secure Delivery',
        description: 'Every order ships quickly and arrives safely, straight to your door.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Payment',
        description: 'Checkout with confidence — your payment details stay fully protected.',
    },
    {
        icon: Headphones,
        title: 'Responsive Support',
        description: 'Fast, friendly help whenever you need it, before or after your order.',
    },
];
