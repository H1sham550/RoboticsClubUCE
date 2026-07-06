# 🤖 Robotics Club UCE

The official website for the **Robotics Club** at **University College of Engineering (UCE)** — a collegiate community dedicated to hands-on experience with robotics, embedded systems, and software engineering.

🔗 **Live Site**: [roboticsclubuce.vercel.app](https://roboticsclubuce.vercel.app)

---

## ✨ Features

### 🎨 Design
- Dark glassmorphic UI with neon accent highlights (orange, pink, cyan)
- Falling cherry blossom particle animation with cursor-reactive physics
- 3D perspective tilt on interactive cards
- Fully responsive across desktop, tablet, and mobile

### 📸 Dynamic Photo Showcase
- GSAP-powered scattered moments wall on the homepage
- Mouse-hover parting physics — photos push away from the cursor
- Live HUD overlay showing photo details on hover
- Click-to-expand modal with full image and description

### 📄 Pages
- **Home** — Hero section, interactive moments photo wall
- **Events** — Upcoming events board and past event achievements with photo previews
- **Team** — Club leadership roster (Convener, Treasurer, Faculty Mentor)
- **Certificates** — Validation console to look up student achievements by Registration Number
- **Suggestions** — Form for students to submit ideas for workshops, hackathons, and gaming events

---

## 📁 Project Structure

```
RoboticsClub/
├── index.html            # Homepage with hero + moments photo wall
├── events.html           # Upcoming & past events
├── team.html             # Club leadership
├── certificate.html      # Certificate validation portal
├── suggestions.html      # Student suggestions form
├── shared.css            # Global styles, animations, glassmorphism
├── shared.js             # Particle system, mobile nav, certificate lookup
├── masonry.js            # GSAP moments wall grid engine
├── masonry-items.js      # Photo metadata for the showcase wall
└── assets/
    ├── logo.png          # Club logo
    └── EventPhotos/      # Event photography collection
```

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Structure  | HTML5                              |
| Styling    | Tailwind CSS (CDN) + Custom CSS    |
| Logic      | Vanilla JavaScript                 |
| Animation  | GSAP 3.12                          |
| Icons      | Font Awesome 6.4                   |
| Hosting    | Vercel (auto-deploys from GitHub)  |

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/H1sham550/RoboticsClubUCE.git
cd RoboticsClubUCE

# Serve locally (pick one)
npx -y http-server -p 8080
# or
python -m http.server 8080
```

Open **http://localhost:8080** in your browser.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📜 License

© 2026 UCE Robotics Club. All rights reserved.
