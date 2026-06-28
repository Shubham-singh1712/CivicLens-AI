import React from 'react';

interface PotholePlaceholderProps {
  className?: string;
  onClick?: () => void;
}

export const PotholePlaceholder: React.FC<PotholePlaceholderProps> = ({ className = "w-full h-full", onClick }) => {
  return (
    <div 
      className={`relative select-none overflow-hidden bg-slate-900 flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 800 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          {/* Concrete Base Gradients */}
          <radialGradient id="concrete-glow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="60%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>

          {/* Pothole Deep Hole Gradient */}
          <radialGradient id="pothole-depth" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#0a0a0c" />
            <stop offset="70%" stopColor="#111115" />
            <stop offset="100%" stopColor="#1e1e24" />
          </radialGradient>

          {/* Rust/Steel Rebar Gradients */}
          <linearGradient id="rebar-rust-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="20%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          <linearGradient id="rebar-rust-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="20%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          {/* Metallic Highlights */}
          <linearGradient id="rebar-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </linearGradient>

          {/* Dropshadow filter for rebar depth */}
          <filter id="rebar-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.95" />
          </filter>

          {/* Dropshadow filter for concrete edge spalling */}
          <filter id="spall-edge-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.7" />
          </filter>

          {/* Concrete Texture Pattern */}
          <pattern id="concrete-grain" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1e293b" opacity="0.3" />
            <circle cx="18" cy="12" r="1" fill="#ffffff" opacity="0.15" />
            <circle cx="32" cy="28" r="1.5" fill="#0f172a" opacity="0.4" />
            <circle cx="8" cy="30" r="1" fill="#ffffff" opacity="0.1" />
            <circle cx="25" cy="35" r="1" fill="#1e293b" opacity="0.3" />
          </pattern>
        </defs>

        {/* --- LAYER 1: Solid Base & Concrete Background --- */}
        <rect width="800" height="450" fill="url(#concrete-glow)" />
        <rect width="800" height="450" fill="url(#concrete-grain)" />

        {/* --- LAYER 2: Major Fractures & Asphalt Cracks --- */}
        <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
          {/* Top-left cracks */}
          <path d="M 230 180 L 120 120 L 50 110 M 120 120 L 90 60 L 20 40 M 120 120 L 150 70" />
          {/* Top-right cracks */}
          <path d="M 540 160 L 660 110 L 730 130 M 660 110 L 710 50 M 660 110 L 610 40" />
          {/* Bottom-left cracks */}
          <path d="M 220 280 L 130 360 L 50 390 M 130 360 L 110 420 M 130 360 L 170 430" />
          {/* Bottom-right cracks */}
          <path d="M 580 270 L 690 350 L 770 380 M 690 350 L 720 420 M 690 350 L 630 400" />
          {/* Fine hairline connecting cracks */}
          <path d="M 380 90 L 390 40 M 420 80 L 460 30 M 150 250 L 80 270" strokeWidth="1" opacity="0.6" />
        </g>

        {/* --- LAYER 3: Outer Pothole Cavity Shadow (Bevel) --- */}
        <path
          d="M 210 180 C 230 140, 350 120, 410 110 C 470 100, 560 120, 600 160 C 640 200, 620 280, 580 300 C 540 320, 420 340, 360 330 C 300 320, 190 300, 180 260 C 170 220, 190 220, 210 180 Z"
          fill="#111827"
          opacity="0.9"
        />

        {/* --- LAYER 4: The Deep Jagged Cavity (The Asphalt Pothole Hole) --- */}
        <path
          d="M 220 190 L 250 155 L 320 135 L 420 125 L 495 130 L 555 145 L 590 175 L 575 220 L 595 255 L 550 295 L 465 315 L 385 310 L 305 315 L 245 285 L 210 240 L 235 215 Z"
          fill="url(#pothole-depth)"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinejoin="miter"
        />

        {/* --- LAYER 5: Inner Broken Concrete Edge Highlights (Spalled Concrete) --- */}
        {/* Broken inner edges with high-contrast sharp polygons to look like concrete chunks */}
        <g fill="#475569" stroke="#64748b" strokeWidth="1" opacity="0.9" filter="url(#spall-edge-shadow)">
          {/* Left broken wedge */}
          <polygon points="220,190 250,155 240,165 215,195" />
          <polygon points="210,240 235,215 225,225 205,245" />
          {/* Top broken slabs */}
          <polygon points="320,135 420,125 400,135 340,140" fill="#94a3b8" />
          <polygon points="420,125 495,130 480,138 440,135" fill="#cbd5e1" />
          {/* Bottom broken slabs */}
          <polygon points="465,315 385,310 395,300 450,305" fill="#334155" />
          <polygon points="385,310 305,315 320,302 375,302" fill="#475569" />
          {/* Right broken chunks */}
          <polygon points="555,145 590,175 570,180 545,155" fill="#94a3b8" />
          <polygon points="595,255 550,295 545,280 575,250" fill="#334155" />
        </g>

        {/* --- LAYER 6: Exposed Rusty Rebar Grid (The Main Feature!) --- */}
        {/* A cross-hatch structure of metal reinforcement bars, some broken and bent */}
        <g filter="url(#rebar-shadow)">
          {/* --- VERTICAL REBARS --- */}
          {/* Vertical Rebar 1 (Leftmost) */}
          <g>
            <rect x="290" y="100" width="12" height="235" rx="3" fill="url(#rebar-rust-v)" />
            {/* Ribbed patterns on rebar */}
            <path d="M 290 115 L 302 119 M 290 135 L 302 139 M 290 155 L 302 159 M 290 175 L 302 179 M 290 195 L 302 199 M 290 215 L 302 219 M 290 235 L 302 239 M 290 255 L 302 259 M 290 275 L 302 279 M 290 295 L 302 299 M 290 315 L 302 319" stroke="#431407" strokeWidth="2.5" />
            <rect x="290" y="100" width="12" height="235" rx="3" fill="url(#rebar-highlight)" opacity="0.35" />
          </g>

          {/* Vertical Rebar 2 (Center-Left) */}
          <g>
            <rect x="375" y="80" width="12" height="260" rx="3" fill="url(#rebar-rust-v)" />
            {/* Ribbed patterns */}
            <path d="M 375 95 L 387 99 M 375 115 L 387 119 M 375 135 L 387 139 M 375 155 L 387 159 M 375 175 L 387 179 M 375 195 L 387 199 M 375 215 L 387 219 M 375 235 L 387 239 M 375 255 L 387 259 M 375 275 L 387 279 M 375 295 L 387 299 M 375 315 L 387 319 M 375 335 L 387 339" stroke="#431407" strokeWidth="2.5" />
            <rect x="375" y="80" width="12" height="260" rx="3" fill="url(#rebar-highlight)" opacity="0.35" />
          </g>

          {/* Vertical Rebar 3 (Center-Right - Broken & Bent!) */}
          <g>
            {/* Top part */}
            <path d="M 465 75 L 465 200 C 465 210, 475 215, 485 215 L 515 215" stroke="url(#rebar-rust-v)" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Ribbed patterns */}
            <path d="M 459 90 L 471 94 M 459 110 L 471 114 M 459 130 L 471 134 M 459 150 L 471 154 M 459 170 L 471 174 M 459 190 L 471 194 M 470 209 L 475 221 M 485 209 L 490 221 M 500 209 L 505 221" stroke="#431407" strokeWidth="2.5" />
            {/* Bottom part (severed and sticking up!) */}
            <path d="M 465 340 L 465 260 C 465 250, 455 240, 440 240 L 420 240" stroke="url(#rebar-rust-v)" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Ribs on bottom part */}
            <path d="M 459 320 L 471 324 M 459 300 L 471 304 M 459 280 L 471 284 M 455 255 L 462 245 M 442 246 L 434 234 M 426 246 L 418 234" stroke="#431407" strokeWidth="2.5" />
          </g>

          {/* Vertical Rebar 4 (Rightmost) */}
          <g>
            <rect x="540" y="90" width="12" height="250" rx="3" fill="url(#rebar-rust-v)" />
            <path d="M 540 105 L 552 109 M 540 125 L 552 129 M 540 145 L 552 149 M 540 165 L 552 169 M 540 185 L 552 189 M 540 205 L 552 209 M 540 225 L 552 229 M 540 245 L 552 249 M 540 265 L 552 269 M 540 285 L 552 289 M 540 305 L 552 309 M 540 325 L 552 329" stroke="#431407" strokeWidth="2.5" />
            <rect x="540" y="90" width="12" height="250" rx="3" fill="url(#rebar-highlight)" opacity="0.35" />
          </g>

          {/* --- HORIZONTAL REBARS --- */}
          {/* Horizontal Rebar 1 (Top) */}
          <g>
            <rect x="180" y="160" width="440" height="12" rx="3" fill="url(#rebar-rust-h)" />
            <path d="M 195 160 L 199 172 M 215 160 L 219 172 M 235 160 L 239 172 M 255 160 L 259 172 M 275 160 L 279 172 M 295 160 L 299 172 M 315 160 L 319 172 M 335 160 L 339 172 M 355 160 L 359 172 M 375 160 L 379 172 M 395 160 L 399 172 M 415 160 L 419 172 M 435 160 L 439 172 M 455 160 L 459 172 M 475 160 L 479 172 M 495 160 L 499 172 M 515 160 L 519 172 M 535 160 L 539 172 M 555 160 L 559 172 M 575 160 L 579 172 M 595 160 L 599 172 M 615 160 L 619 172" stroke="#431407" strokeWidth="2.5" />
            <rect x="180" y="160" width="440" height="12" rx="3" fill="url(#rebar-highlight)" opacity="0.35" />
          </g>

          {/* Horizontal Rebar 2 (Middle - Severed & Sticking Straight Up!) */}
          <g>
            {/* Left side extending in, then bent outward! */}
            <path d="M 150 225 L 340 225 C 355 225, 360 215, 360 200 L 360 175" stroke="url(#rebar-rust-h)" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Ribbed patterns */}
            <path d="M 165 219 L 169 231 M 185 219 L 189 231 M 205 219 L 209 231 M 225 219 L 229 231 M 245 219 L 249 231 M 265 219 L 269 231 M 285 219 L 289 231 M 305 219 L 309 231 M 325 219 L 329 231 M 344 219 L 354 227 M 354 205 L 366 200 M 354 185 L 366 180" stroke="#431407" strokeWidth="2.5" />

            {/* Right side extending in */}
            <path d="M 620 225 L 410 225" stroke="url(#rebar-rust-h)" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Ribs */}
            <path d="M 605 219 L 609 231 M 585 219 L 589 231 M 565 219 L 569 231 M 545 219 L 549 231 M 525 219 L 529 231 M 505 219 L 509 231 M 485 219 L 489 231 M 465 219 L 469 231 M 445 219 L 449 231 M 425 219 L 429 231" stroke="#431407" strokeWidth="2.5" />
          </g>

          {/* Horizontal Rebar 3 (Bottom) */}
          <g>
            <rect x="200" y="280" width="380" height="12" rx="3" fill="url(#rebar-rust-h)" />
            <path d="M 215 280 L 219 292 M 235 280 L 239 292 M 255 280 L 259 292 M 275 280 L 279 292 M 295 280 L 299 292 M 315 280 L 319 292 M 335 280 L 339 292 M 355 280 L 359 292 M 375 280 L 379 292 M 395 280 L 399 292 M 415 280 L 419 292 M 435 280 L 439 292 M 455 280 L 459 292 M 475 280 L 479 292 M 495 280 L 499 292 M 515 280 L 519 292 M 535 280 L 539 292 M 555 280 L 559 292" stroke="#431407" strokeWidth="2.5" />
            <rect x="200" y="280" width="380" height="12" rx="3" fill="url(#rebar-highlight)" opacity="0.35" />
          </g>
        </g>

        {/* --- LAYER 7: Tie Wire Knots (Where Horizontal and Vertical Rebars Meet) --- */}
        <g stroke="#2d3748" strokeWidth="2" fill="none">
          {/* Wrap loops around intersections to look like metal wire ties */}
          <path d="M 293 158 C 291 164, 299 168, 297 174" />
          <path d="M 378 158 C 376 164, 384 168, 382 174" />
          <path d="M 543 158 C 541 164, 549 168, 547 174" />
          <path d="M 293 278 C 291 284, 299 288, 297 294" />
          <path d="M 378 278 C 376 284, 384 288, 382 294" />
          <path d="M 543 278 C 541 284, 549 288, 547 294" />
        </g>

        {/* --- LAYER 8: Warning Overlays & Civic Aesthetics --- */}
        {/* Adds that elite, professional craftsmanship: high contrast industrial styling */}
        <g opacity="0.95">
          {/* Top-left Hazard Stripes Banner */}
          <g transform="translate(-10, -5) rotate(4) scale(0.9)">
            <rect x="20" y="25" width="280" height="26" fill="#1e293b" rx="4" stroke="#eab308" strokeWidth="1.5" />
            <path d="M 20 25 L 35 51 M 50 25 L 65 51 M 80 25 L 95 51 M 110 25 L 125 51 M 140 25 L 155 51 M 170 25 L 185 51 M 200 25 L 215 51 M 230 25 L 245 51 M 260 25 L 275 51" stroke="#eab308" strokeWidth="5" />
            <text x="50" y="42" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="900" letterSpacing="1">DANGER: EXPOSED REBAR</text>
          </g>

          {/* Bottom-right Scale/Tech marker */}
          <g transform="translate(560, 395)">
            <rect width="210" height="30" fill="rgba(15, 23, 42, 0.85)" rx="4" stroke="#0ea5e9" strokeWidth="1" />
            <text x="12" y="19" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="700">GRID: 15cm | CONFIDENCE: 98%</text>
            <line x1="170" y1="15" x2="200" y2="15" stroke="#38bdf8" strokeWidth="2" />
            <line x1="170" y1="11" x2="170" y2="19" stroke="#38bdf8" strokeWidth="2" />
            <line x1="200" y1="11" x2="200" y2="19" stroke="#38bdf8" strokeWidth="2" />
          </g>
        </g>

        {/* Decorative corner brackets to reinforce the analyzer vibe */}
        <g stroke="#0ea5e9" strokeWidth="3" opacity="0.7" fill="none">
          <path d="M 30 30 L 15 30 L 15 45" />
          <path d="M 770 30 L 785 30 L 785 45" />
          <path d="M 30 420 L 15 420 L 15 405" />
          <path d="M 770 420 L 785 420 L 785 405" />
        </g>
      </svg>
    </div>
  );
};
