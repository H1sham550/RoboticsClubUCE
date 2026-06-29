# Robotics Club UCE

A premium, modern, glassmorphic multi-page website designed for the **Robotics Club of University College of Engineering (UCE)**. The site is optimized for mobile viewports, features 3D card/ticket interactive elements, and is ready for free hosting on Vercel.

## 🚀 Live Preview & Hosting
The website is structured as a static HTML/CSS/JS application, making it fully compatible with Vercel's free tier. 
Every time you push changes to your GitHub repository, Vercel will automatically redeploy the site.

## ✨ Features
- **Modern Glassmorphic UI**: Sleek dark backgrounds with glowing neon highlights, glass borders, and dynamic backdrop blurring.
- **Interactive Spawning Physics**: Falling neon cherry blossom particles that drift across the screen and scatter when they get near the user's cursor.
- **3D Card Perspective Tilt**: Interactive hover tilts on membership cards and ticket passes.
- **Dynamic Certificate Lookup**: A validation console that lets students search by University Registration Number (e.g. `UCE26041`) and instantly displays their achievement portfolio with links to download certificates from Google Drive.
- **Ideas & Suggestions Portal**: An interactive form on the landing page for students to submit suggestions for upcoming workshops, coding hackathons, and esports gaming events.
- **Mobile First Optimization**: Fully responsive layout wrapping, flex grids, and a slide-out hamburger navigation drawer built specifically for mobile screens.

## 📁 File Structure
- `index.html`: The landing page containing the Hero introduction, core focus areas (Workshops, Competitions, Gaming), and the Student Suggestions form.
- `team.html`: Lists the club leadership roster (Club Convener, Treasurer, and Faculty Mentor).
- `events.html`: Displays upcoming event statuses and features a grid showcase of completed past initiatives (VR Experience, Arduino Workshop, F1 Gaming Tournament, etc.).
- `certificate.html`: The secure validation panel for checking credentials by Registration Number.
- `membership.html`: Shows registration status and details regarding student pass renewals.
- `shared.css`: Central stylesheet containing variables, resets, layout panels, and animations.
- `shared.js`: Central logic file housing mobile drawer handlers, particle animation loops, payment warnings, and certificate database checks.
- `assets/logo.png`: The cropped, high-resolution official club branding logo.

## 🛠️ Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/RoboticsClub.git
   ```
2. Simply double-click `index.html` to open it in your browser, or run a local python development server:
   ```bash
   python -m http.server 8000
   ```
3. Open **`http://localhost:8000`** in your browser.
