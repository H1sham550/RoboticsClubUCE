# 🤖 Robotics Club UCE

The official website for the **Robotics Club** at **University College of Engineering (UCE)** — a collegiate community dedicated to hands-on experience with robotics, embedded systems, esports, and software engineering.

🔗 **Live Site**: [roboticsclub.ucet.ac.in](https://roboticsclub.ucet.ac.in)

---

## ✨ Features

### 🎨 Design & Visuals
- Dark glassmorphic UI with neon accent highlights (orange, pink, cyan)
- Falling cherry blossom particle animation with cursor-reactive physics
- 3D perspective tilt on interactive cards
- Fully responsive layout across desktop, tablet, and mobile devices
- High-performance WebP media pipeline for ultra-fast asset loading

### 📸 Dynamic Photo Showcase
- GSAP-powered scattered moments wall on the homepage
- Mouse-hover parting physics — photos push away from the cursor
- Live HUD overlay showing photo details on hover
- Touch & gesture-optimized lightbox modal with pinch-zoom support

### 📄 Pages
- **Home** — Hero section, interactive moments photo wall, club overview
- **Events** — Upcoming workshops, past event achievements (FIFA23 Gaming Tournament, Arduino Workshops, VR Expos, F1 Esports) with expandable photo galleries
- **Team** — Club leadership roster (Convener, Treasurer, Faculty Mentors)
- **Certificates** — Validation console to look up student achievements by Registration Number
- **Suggestions** — Interactive form for students to submit ideas (integrated with Google Sheets backend)

---

## 📁 Project Structure

```
RoboticsClub/
├── index.html            # Homepage with hero + moments photo wall
├── events.html           # Upcoming & past events (FIFA23, Arduino, VR, etc.)
├── team.html             # Club leadership
├── certificate.html      # Certificate validation portal
├── suggestions.html      # Student suggestions form
├── shared.css            # Global design system, glassmorphism, responsive utilities
├── tailwind.css          # Standalone compiled production Tailwind CSS
├── shared.js             # Particle system, mobile nav, certificate lookup, form engine
├── masonry.js            # GSAP moments wall grid engine
├── masonry-items.js      # Photo metadata for showcase wall
└── assets/
    ├── logo.png          # Club logo badge
    └── EventPhotos/      # WebP optimized event photography collections
```

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Structure  | HTML5 (Semantic & Accessible)      |
| Styling    | Compiled Tailwind CSS + Custom CSS |
| Media      | FFmpeg WebP Optimization Pipeline  |
| Logic      | Vanilla JavaScript (ES6+)          |
| Animation  | GSAP 3.12                          |
| Icons      | Font Awesome 6.4                   |
| Hosting    | Vercel (Auto-deploys from GitHub)  |

---

## 🚀 Running Locally

```bash
# Clone the repository via SSH (Recommended)
git clone git@github.com:H1sham550/RoboticsClubUCE.git
cd RoboticsClubUCE

# Or clone via HTTPS
git clone https://github.com/H1sham550/RoboticsClubUCE.git
cd RoboticsClubUCE

# Serve locally (pick one)
npx -y http-server -p 8080
# or
python3 -m http.server 8080
```

Open **http://localhost:8080** in your browser.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📜 License

© 2026 UCE Robotics Club. All rights reserved.

