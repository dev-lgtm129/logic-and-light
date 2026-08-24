<div align="center">

# LOGIC & LIGHT

### *Architectural Software Engineering & Minimalist Visual Arts*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

A high-performance, spatial web application designed with precision engineering, clean control flow, and monochrome aesthetic elegance. Seamlessly bridges software design systems with visual photography.

</div>

<br />

## Key Engineering Features

- **Retro Split-Flap Matrix Display**: Real-time mechanical split-flap text board with 1.0s flip animations, dynamic live counting of photography feeds & coding repositories, real-time clock, and a time-based easter egg system.
- **3D Perspective Memory Array Grid**: Interactive 9x7 perspective grid featuring custom hover digit decay and soft radial edge fading.
- **Dynamic Photography Gallery Stream**: Dual-row staggered gallery feed with dynamic image preloading and fluid full-screen lightbox interactions.
- **Button Wipe Page Transitions**: Custom spatial page transitions between Home, Coding, and Photography modules.
- **Minimalist Monochromatic Aesthetic**: Curated dark-mode design system built with custom Geist variable typography, glassmorphism, and subtle micro-animations.

---

## Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) |
| **Styling & System** | [Tailwind CSS v4](https://tailwindcss.com/), Custom Design Tokens |
| **Animations & 3D** | [Framer Motion](https://www.framer.com/motion/), CSS 3D Perspective Transforms |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [Base UI](https://base-ui.com/) |

---

## Project Structure

```bash
logic-and-light/
├── public/
│   └── photos/
│       ├── gallery/          # Dynamic photography feed assets
│       └── hero-collision/   # Landing page collision photography
├── src/
│   ├── components/
│   │   ├── animate-ui/       # Micro animated icons & UI primitives
│   │   ├── coding/           # 3D Memory Array Grid & Project Folders
│   │   ├── ui/               # Split-Flap board engine & button components
│   │   ├── AsciiBackground.tsx  # Dynamic ASCII canvas background
│   │   ├── GalleryStream.tsx    # Staggered photo stream & lightbox
│   │   ├── Hero.tsx             # Spatial landing hero section
│   │   └── RetroSplitFlap.tsx   # Split-flap state machine & clock feed
│   ├── pages/
│   │   ├── CodingPage.tsx       # System architecture & repos showcase
│   │   └── PhotographyPage.tsx  # Interactive photography stream showcase
│   ├── utils/
│   │   ├── photoLoader.ts       # Dynamic Vite glob asset loader
│   │   ├── projectConfig.ts     # Repositories metadata configuration
│   │   └── timeEasterEggs.ts    # Time-based message configuration
│   ├── App.tsx                  # Root app router & stage manager
│   └── main.tsx                 # Entrypoint
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the repository
```bash
git clone https://github.com/dev-lgtm129/logic-and-light.git
cd logic-and-light
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

### 5. Preview production build
```bash
npm run preview
```

---

## Configuration & Customization

- **Time Easter Eggs**: Edit [`src/utils/timeEasterEggs.ts`](src/utils/timeEasterEggs.ts) to update time-based messages displayed on the split-flap board.
- **GitHub Repositories**: Add or edit projects in [`src/utils/projectConfig.ts`](src/utils/projectConfig.ts).
- **Photography Feed**: Drop new images directly into `public/photos/gallery/` — they are dynamically loaded via Vite glob imports automatically!

---

<div align="center">

Crafted with precision by **Devansh** &bull; **Logic & Light** © 2026

</div>
