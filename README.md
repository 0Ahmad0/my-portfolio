# 🚀 My Portfolio — Pro Max Personal Portfolio Website

A cutting-edge, fully responsive personal portfolio website featuring advanced animations, dark/light mode support, English/Arabic (RTL) localization, and a password-protected admin dashboard for managing portfolio content.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.3.2-646cff.svg)

---

## ✨ Features

### 🎨 Visual Design
- **Animated Aurora Background** - 7 animated aurora orbs with 80+ floating particles (4 different shapes)
- **Responsive Hero Section** - Animated typewriter roles with dynamic font sizing (mobile to desktop)
- **Hexagon Profile Picture** - Animated avatar with pulsing border-radius and 6 orbiting skill icons
- **Animated Testimonials Carousel** - 3D perspective animations with auto-scroll (5 seconds), spring physics, and staggered elements

### 🌍 Localization
- **Bilingual Support** - Full English/Arabic (RTL) support
- **Dynamic Theme** - Dark/light mode with theme-aware opacity adjustments
- **Responsive Typography** - Arabic text rendering optimized for ligatures and proper text flow

### 🔐 Admin Dashboard
- **Password-Protected Access** - Dashboard accessible at `/dashboard` (password: `admin123`)
- **Editable Sections**:
  - Projects (add/edit/delete with descriptions and links)
  - Experience (manage work history with dates and descriptions)
  - Education (track educational background)
  - Certificates (showcase achievements)
  - Testimonials (manage client/user feedback with ratings and images)
  - Floating Skills (configure orbiting skill icons around profile picture)

### 📱 Mobile-First Responsive Design
- Seamless experience from mobile to desktop
- Touch-friendly navigation (dots for carousel on mobile)
- Hidden navigation buttons on mobile devices
- Optimized performance metrics

---

## 🛠️ Tech Stack

### Frontend Framework
- **React** `19.1.0` - UI library
- **Vite** `7.3.2` - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe development

### Styling & Animation
- **Tailwind CSS** `4.1.14` - Utility-first CSS framework
- **Framer Motion** `12.23.24` - Advanced animation library
- **Class Variance Authority** - Component styling patterns
- **TailwindMerge** - Intelligent CSS class merging

### UI Components
- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** `0.545.0` - Beautiful SVG icon library

### Theming & Localization
- **next-themes** `0.4.6` - Next.js-like theme management for React
- **wouter** `3.3.5` - Lightweight client-side router

### Form & Validation
- **React Hook Form** - Performant, flexible form management
- **Zod** `3.25.76` - TypeScript-first schema validation
- **@hookform/resolvers** - Zod resolver for React Hook Form

### Data Management
- **React Query** `5.90.21` - Server state management (ready for API integration)
- **LocalStorage** - Client-side data persistence (configurable for backend)

### Development Tools
- **TypeScript** `^5.x` - Static type checking
- **Tailwind CSS Vite Plugin** - Fast CSS compilation
- **@vitejs/plugin-react** - Fast refresh and optimizations

---

## 📋 Requirements

### System Requirements
- **Node.js** `^18.0.0` or higher
- **pnpm** `^8.0.0` or higher (package manager)
- **Git** `^2.30.0` (for version control)

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Optional for Deployment
- **GitHub Account** - For version control and Actions
- **Vercel Account** - For seamless deployment (recommended)
- **Netlify Account** - Alternative deployment option

### Supabase Required Files
- `supabase-schema.md` - Full database schema reference.
- `supabase/migrations/20260510011500_portfolio_schema.sql` - Base Supabase schema, including `portfolio_personal_info.core_skills`.
- `supabase/migrations/20260627120000_add_core_skills.sql` - Adds `core_skills` to existing databases.
- `supabase/seed.sql` - Starter portfolio data, including `core_skills` values.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/0Ahmad0/my-portfolio.git
cd my-portfolio
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Start Development Server

```bash
pnpm --filter @workspace/portfolio run dev
```

The portfolio will be available at `http://localhost:5173` (or the assigned PORT if in Replit).

### 4. Access Admin Dashboard

Navigate to `/dashboard` and enter the password: `admin123`

---

## 📂 Project Structure

```
my-portfolio/
├── artifacts/
│   ├── portfolio/                    # Main portfolio application
│   │   ├── src/
│   │   │   ├── components/          # Reusable React components
│   │   │   │   ├── Hero.tsx         # Hero section with typewriter
│   │   │   │   ├── About.tsx        # About section with hexagon avatar
│   │   │   │   ├── Testimonials.tsx # Carousel testimonials
│   │   │   │   ├── AnimatedBackground.tsx
│   │   │   │   └── ui/              # shadcn/ui components
│   │   │   ├── pages/
│   │   │   │   ├── Portfolio.tsx    # Main portfolio page
│   │   │   │   └── Dashboard.tsx    # Admin dashboard
│   │   │   ├── contexts/
│   │   │   │   └── PortfolioContext.tsx # Global state management
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── lib/
│   │   │   │   └── i18n.ts          # Translations (EN/AR)
│   │   │   ├── App.tsx              # Root component
│   │   │   ├── main.tsx             # Entry point
│   │   │   └── index.css            # Global styles
│   │   ├── public/                  # Static assets
│   │   ├── vite.config.ts           # Vite config (Replit)
│   │   ├── vite.config.deploy.ts    # Vite config (Production)
│   │   └── tsconfig.json            # TypeScript config
│   ├── api-server/                  # Backend API (Node.js/Express) - Optional
│   └── mockup-sandbox/              # Component preview server
├── lib/                             # Shared libraries
├── .github/
│   └── workflows/                   # GitHub Actions CI/CD
├── vercel.json                      # Vercel deployment config
├── netlify.toml                     # Netlify deployment config
├── pnpm-workspace.yaml              # Workspace configuration
├── tsconfig.json                    # Root TypeScript config
└── README.md                        # This file
```

---

## 🎯 Key Components

### Hero Component (`src/components/Hero.tsx`)
- Animated typewriter effect for role display
- Responsive font sizing (text-3xl to text-8xl)
- Optimized Arabic text rendering
- Smooth scroll button with chevron animation

### Testimonials Carousel (`src/components/Testimonials.tsx`)
- Auto-scrolling every 5 seconds
- 3D rotation animations on slide transitions
- Spring physics for natural motion
- Staggered animations for quote, stars, author
- Dot indicators for manual navigation
- Hidden navigation arrows on mobile

### Hexagon Avatar (`src/components/About.tsx`)
- Animated hexagon shape with pulsing border-radius
- 6 configurable floating skill icons
- Configurable from dashboard
- Smooth orbital animations

### Animated Background (`src/components/AnimatedBackground.tsx`)
- 7 animated aurora orbs
- 80+ floating particles (4 shape varieties)
- Responsive opacity (65% reduced in light mode)
- Layered depth effect

---

## 🔧 Development Commands

```bash
# Start development server
pnpm --filter @workspace/portfolio run dev

# Build for production
pnpm --filter @workspace/portfolio run build:deploy

# Build for Replit
pnpm --filter @workspace/portfolio run build

# Type checking
pnpm --filter @workspace/portfolio run typecheck

# Preview production build
pnpm --filter @workspace/portfolio run serve
```

---

## 🎨 Customization

### Change Dashboard Password
Edit `src/pages/Dashboard.tsx`:
```typescript
const PASSWORD = "your-new-password";
```

### Add/Edit Testimonials
1. Navigate to `/dashboard`
2. Go to "Testimonials" tab
3. Click "Add Testimonial" or edit existing ones
4. Data is saved to browser localStorage

### Configure Floating Skills
1. Go to Dashboard → "Profile" or "About" tab
2. Add/edit skill icons around the hexagon
3. Changes persist in localStorage

### Change Theme Colors
Modify Tailwind config in `tailwind.config.js` or edit CSS variables in `src/index.css`

### Toggle Language
Click the language switcher (EN/AR) in the navigation bar

---

## 🚀 Deployment

### Option 1: Vercel (Recommended) ⭐

1. **Push to GitHub** (already done)
2. **Connect Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your repository
   - Vercel auto-detects `vercel.json` configuration
   - Click "Deploy"

3. **Your site will be live in ~1 minute** at `https://my-portfolio.vercel.app`

### Option 2: Netlify

1. **Push to GitHub**
2. **Connect Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your GitHub repo
   - Netlify auto-detects `netlify.toml`
   - Click "Deploy"

### Option 3: GitHub Pages

```bash
# Add to package.json
"deploy": "pnpm run build:deploy && echo 'my-portfolio.github.io' > dist/CNAME && git add dist && git commit -m 'Deploy' && git subtree push --prefix dist origin gh-pages"

pnpm run deploy
```

---

## 📊 Performance Optimizations

- ✅ Image optimization (PNG/WebP)
- ✅ Code splitting with Vite
- ✅ CSS minification with Tailwind
- ✅ Component lazy loading ready
- ✅ Efficient animations with Framer Motion
- ✅ LocalStorage caching for instant load

---

## 🔐 Security

- ✅ No API keys exposed in code
- ✅ Session-based dashboard auth (stored in sessionStorage)
- ✅ Input validation with Zod
- ✅ XSS protection via React sanitization
- ✅ CSRF protection ready for backend integration

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Clear Cache & Reinstall
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Fails
```bash
# Clear build artifacts
rm -rf artifacts/portfolio/dist
pnpm --filter @workspace/portfolio run build:deploy
```

### Dashboard Not Accessible
- Ensure you're at the correct password-protected route (`/dashboard`)
- Try clearing browser cache and localStorage
- Password is case-sensitive: `admin123`

### Supabase `core_skills` Schema Cache Error
If Supabase returns `Could not find the 'core_skills' column of 'portfolio_personal_info' in the schema cache`, run:

```sql
alter table portfolio_personal_info
  add column if not exists core_skills text[] not null default '{}'::text[];
```

Then refresh/restart the Supabase API/PostgREST schema cache and retry.

---

## 📈 Future Enhancements

- [ ] Backend integration (Node.js/Express API)
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Email contact form submission
- [ ] Blog section with markdown support
- [ ] Dark mode image optimization
- [ ] Performance monitoring (Sentry)
- [ ] SEO optimization (Meta tags, JSON-LD)
- [ ] PWA capabilities (offline support)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ahmad** - [@0Ahmad0](https://github.com/0Ahmad0)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For questions or issues:
- Open an issue on [GitHub Issues](https://github.com/0Ahmad0/my-portfolio/issues)
- Contact: [Your contact info]

---

## 🙏 Acknowledgments

- React & Vite teams for incredible tooling
- Framer Motion for smooth animations
- Radix UI & shadcn/ui for component foundations
- Tailwind CSS for utility-first styling
- Next.js theming inspiration

---

**Made with ❤️ by Ahmad-Alhariri| Last Updated: May 2026**


