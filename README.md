<div align="center">
  <img src="public/android-chrome-192x192.png" alt="Void Loot Logo" width="120" />
  
  # 🎮 Void Loot
  
  **A next-gen gaming platform and digital storefront featuring PWA capabilities, an interactive 3D showcase, and full internationalization.**
  
  [![Deploy with Vercel](https://vercelbadge.vercel.app/api/VfarzadV/my-gaming-site)](https://vercel.com/new/clone?repository-url=https://github.com/VfarzadV/my-gaming-site)
  <br />
  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=redux&logoColor=white)](https://github.com/pmndrs/zustand)
  [![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#)

### 🚀 [**Live Demo**](https://void-loot.vercel.app/)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Architecture & Under The Hood](#-architecture--under-the-hood)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Developer](#-developer)

---

## 📖 About the Project

**Void Loot** is a modern, scalable gaming platform and digital storefront engineered with **Next.js 16 (App Router)** and powered by **Turbopack**. Integrated with the **RAWG API**, it allows users to explore thousands of games, inspect Metacritic scores, view hardware system requirements, and enjoy immersive e-commerce features including dynamic cart management, wishlists, and interactive 3D loot boxes.

---

## ✨ Key Features

- **🎮 RAWG Video Games API Integration:** Advanced game discovery with platform filters (PC, PlayStation, Xbox), genre sorting, and rich game details.
- **🧊 Interactive 3D Loot Box:** High-performance in-browser 3D rendering using `Three.js`, `React Three Fiber`, and `@react-three/drei`.
- **🛒 Digital Storefront & Hardware:** Comprehensive cart management and persistent wishlist handling backed by Zustand and simulated checkout flows.
- **🌐 Full Internationalization (i18n):** Seamless bilingual experience supporting English (`en`) and Persian (`fa`) with full RTL and LTR directional layouts.
- **📱 Progressive Web App (PWA):** Fully installable on desktop and mobile devices equipped with custom multi-resolution icons and a `manifest.json` configuration.
- **⚡ Advanced SEO & Performance:** Optimized with dynamic metadata generation, OpenGraph tags, and Schema.org (`JSON-LD`) structured data.

---

## 🧠 Architecture & Under The Hood

- **Global State Management:** Leverages `Zustand` with `persist` middleware for robust synchronization of carts and wishlists across sessions via `localStorage`.
- **Safe Hydration Handling:** Custom mounting safeguards to prevent server/client rendering discrepancies in Next.js.
- **Performance Optimization:** Dynamic imports for heavy 3D components and optimized network queries powered by `TanStack React Query`.
- **App Router Architecture:** Strict separation between server-rendered components (for maximum SEO) and interactive client components.

---

## 💻 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Languages:** TypeScript, JavaScript
- **Styling & Icons:** Tailwind CSS v4, Lucide React
- **State Management:** Zustand
- **3D Graphics & Animation:** Framer Motion, Three.js, React Three Fiber, `@react-three/drei`
- **Forms & Validation:** React Hook Form, Zod
- **Internationalization:** next-intl
- **Rendering:** React 19, Server & Client Components
- **Data Sources:** RAWG Video Games Database API, DummyJSON REST API

---

## 📂 Folder Structure

```text
src/
├── app/                  # Next.js App Router root & pages
│   ├── [locale]/         # Internationalized routes (en / fa)
│   │   ├── cart/         # Shopping cart drawer/page
│   │   ├── checkout/     # Simulated secure checkout
│   │   ├── games/        # Game catalog and dynamic details
│   │   ├── loot-box/     # Interactive 3D chamber
│   │   ├── profile/      # User dashboard & order history
│   │   └── shop/         # Tech hardware & accessories store
├── components/           # Modular UI, 3D canvases, and layout components
├── store/                # Zustand global state stores
└── public/               # Static assets, icons, GLB models, and PWA manifest

🚀 Getting Started

To run this project locally on your machine, follow these steps:
Prerequisites

    Node.js (v18 or higher recommended)

    npm or yarn package manager

Setup Instructions

1. Clone the repository:
Bash

git clone [https://github.com/VfarzadV/my-gaming-site.git](https://github.com/VfarzadV/my-gaming-site.git)
cd game-store

2. Install dependencies:
Bash

npm install

3. Set up environment variables:
Create a .env.local file in the root directory and add your RAWG API key:
Code snippet

NEXT_PUBLIC_RAWG_API_KEY=your_rawg_api_key_here

4. Run the development server:
Bash

npm run dev

Open http://localhost:3000 in your browser.
🗺️ Roadmap

    [x] Initialize Next.js 16 App Router architecture with Turbopack

    [x] Integrate RAWG API with real-time filtering and search

    [x] Implement interactive 3D loot box using Three.js and React Three Fiber

    [x] Add next-intl localization with full RTL/LTR switching

    [x] Configure PWA manifest and multi-platform icons

👤 Developer

Farzad Vatandoust

    GitHub: VfarzadV
```
