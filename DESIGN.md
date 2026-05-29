# 🎨 FSIN Calculator Pro — Vibe Design System (`DESIGN.md`)

This file is a **Google Stitch** compatible vibe-design asset. It establishes the visual language, color tokens, layout specifications, and animation standards for the FSIN Calculator application. All AI coding assistants (like Antigravity) must strictly adhere to these rules when styling new components or pages.

---

## 🌌 The Visual Vibe: "Deep Glassmorphism"

The aesthetic is **premium, futuristic, and dark**—evoking the security, professionalism, and high-fidelity precision of a professional financial tool, mixed with sleek, game-like visual cues.

*   **Key Themes:** Deep space backdrop, floating frosted-glass surfaces, glowing ambient gradients, and crisp typographic contrast.
*   **Visual Philosophy:** Avoid flat elements. Everything should have depth, subtle shadows, and light borders to create a layered 3D hierarchy.

---

## 🎨 Color Palette & Design Tokens

Harmony is maintained using tailored HSL values and translucent hex layers:

| Token | CSS/Tailwind Class | Value / Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-slate-950` | `#020617` | The deepest background layer |
| **App Surface** | `bg-slate-900/50` | `rgba(15, 23, 42, 0.5)` | Base layer for panels |
| **Frosted Glass** | `bg-slate-900/75 backdrop-blur-2xl` | `rgba(15, 23, 42, 0.75)` | Floating cards and headers |
| **Glow Primary** | `text-blue-400` / `from-blue-500` | `#60a5fa` | Primary actions, calculation totals |
| **Glow Accent** | `text-indigo-400` / `to-indigo-500` | `#818cf8` | Subheadings, links, focus borders |
| **Glow Alert** | `text-rose-400` / `from-rose-500` | `#fb7185` | Deletion actions, warning badges, cancel states |
| **Success Indicator** | `text-emerald-400` | `#34d399` | Confirmations, success ticks, "Pro" status |

---

## 🧱 Component Styling Blueprint

### 1. The Ultimate Glass Card
Every major panel, widget, or form must use this exact structure to guarantee depth:
*   **Background:** `bg-slate-900/50 backdrop-blur-xl`
*   **Border:** `border border-slate-800/80` (or `border-slate-700/50` for highlighted states)
*   **Shadow:** `shadow-2xl shadow-black/40`
*   **Border Radius:** `rounded-3xl` (large, organic rounded corners)
*   *Bonus Glow:* A 1px top-border gradient (`bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/0`) to simulate overhead lighting.

### 2. Glass Inputs
*   **Style:** `bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none transition-all`
*   **Active Focus State:** `focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10` (soft glow instead of harsh outline).
*   **Corners:** `rounded-xl`

### 3. Glow Action Buttons
*   **Primary Action (Blue-Indigo):**
    *   **Class:** `bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all`
*   **Secondary Action (Slate Glass):**
    *   **Class:** `bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl font-medium transition-all`

---

## ✨ Micro-Animations & Interactivity

Static pages are boring. The app should feel alive:

1.  **Button Hover Scaling:** All interactive buttons must scale up slightly on hover and compress when clicked:
    ```javascript
    // Framer Motion standard tokens:
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    ```
2.  **Slide & Scale Entry:** New UI blocks, modal dialogs, and chat bubbles must slide up from the bottom:
    ```javascript
    // Entry animation tokens:
    initial={{ opacity: 0, y: 15, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    ```
3.  **Floating Ambient Glow:** Floating or background elements can slowly pulse or float:
    ```css
    @keyframes pulse-glow {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.05); opacity: 0.5; }
    }
    ```

---

## 📱 Responsiveness Guidelines

*   **Paddings:** Use responsive container paddings: `p-4 md:p-8`
*   **Grid Systems:** Columns should collapse gracefully: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
*   **Widgets:** Support widgets or floating bars must contract on screens narrower than `640px` (e.g. taking `w-full h-full` or maximum width with `bottom-0 right-0 rounded-none` for mobile viewports).
