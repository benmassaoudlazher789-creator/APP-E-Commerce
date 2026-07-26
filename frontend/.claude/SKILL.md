# Frontend Design Skill — Red Store

Use this skill whenever building or editing UI for this e-commerce project.

## Color Tokens
- Primary: #E63946 (red)
- Primary Dark: #C1121F
- Background: #FFFFFF
- Surface: #F8F9FA
- Text Primary: #1D1D1D
- Text Secondary: #6C757D
- Border: #E5E5E5
- Success: #2A9D8F
- Error: #D62828

## Typography
- Font: Inter or Poppins (sans-serif)
- H1: 48px / bold / -0.02em letter spacing
- H2: 32px / bold
- H3: 24px / semibold
- Body: 16px / regular / line-height 1.6
- Small: 14px / regular

## Spacing (8px grid)
Use multiples of 8px for all margins/padding: 8, 16, 24, 32, 48, 64, 96px.

## Component Patterns
- Buttons: rounded-lg (8px radius), red primary, white text, subtle hover scale (1.02) + shadow
- Product cards: white bg, soft shadow, rounded corners, image top, hover lift effect
- Navbar: sticky, white bg with subtle shadow on scroll
- Cart: slide-in drawer from the right, clear price breakdown

## Animation Rules
- Use Framer Motion for every interactive element
- Scroll-triggered fade + slight upward translate on sections
- Staggered reveal for product grids (0.1s delay between items)
- Smooth hover transitions (200-300ms ease)
- No jarring or bouncy animations — keep it premium and subtle

## Avoid
- Generic AI aesthetic: no purple gradients, no default Bootstrap look
- Overly rounded "bubbly" UI
- Center-aligning everything by default
- Excessive shadows or glassmorphism unless intentional