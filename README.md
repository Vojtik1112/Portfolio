# Vojta Novák – Personal Portfolio Website

A modern, single-page personal portfolio site showcasing my skills, projects, experience and contact details. The site focuses on clarity, subtle interactivity, responsive design and performance.

> Status: Active – continuously refined as I learn and build new things.

## Live Demo

Visit: https://vojtik1112.github.io/Portfolio (GitHub Pages)

## Features

- **Hero / Home Section** – Intro, concise tagline, quick access buttons (GitHub, LinkedIn, Resume download).
- **About Me** – Background, learning focus, interests in technology.
- **Skills** – Categorised list (Languages, Frameworks & Libraries, Databases & Tools).
- **Projects Showcase** – Each project highlights: description, tech stack, live demo link and source code link.
- **Contact Section** – Clear call to action with email link.
- **Responsive Layout** – Optimised for desktop, tablet and mobile.
- **Visual & Interactive Enhancements**:
  - WebGL liquid / glass-like animated background reacting to cursor movement.
  - Section fade-in + upward slide scroll animations.
  - Magnetic / attractor effect buttons in hero & contact areas.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Markup | HTML5 |
| Styling | Tailwind CSS (utility-first), Custom CSS utilities (if needed) |
| Scripting | Vanilla JavaScript (ES6+) |
| Graphics / Effects | WebGL (custom shader / canvas logic) |
| Assets | Google Fonts (Poppins, Lato), Font Awesome Icons |
| Tooling | Git & GitHub |

## Repository Structure (Indicative)
```
Portfolio/
├── index.html
├── assets/           # Images, icons, media
├── css/              # Tailwind build or additional custom styles
├── js/               # Interaction, animations, WebGL scripts
├── favicon.ico
└── README.md
```
## Getting Started

### 1. Clone
```bash
git clone https://github.com/Vojtik1112/Portfolio.git
cd Portfolio
```

### 2. Open
If this is a static build (no bundler):
```text
Open index.html in your browser
```
You can simply double-click `index.html` or serve it locally (recommended for correct relative paths):
```bash
# Python 3 simple server (choose one)
python -m http.server 5173
# or
python3 -m http.server 5173

# Then visit: http://localhost:5173
```

### 3. (Optional) Tailwind Workflow
If Tailwind is used via CDN you can skip this. If a build pipeline exists, a typical workflow might look like:
```bash
# Install dependencies (if package.json exists)
npm install
# Watch & build Tailwind
npx tailwindcss -i ./src/input.css -o ./css/tailwind.css --watch
```
Update this section to reflect the actual setup if different.

## Customization

- Replace placeholder project cards in the Projects section with new repositories or achievements.
- Adjust the skills JSON/array or markup to dynamically render categories (if scripted).
- Tweak animation durations / easing inside the JS files.
- Modify shader or canvas parameters (WebGL effect) for different visual behaviour.

## Performance Tips

- Compress large images (use WebP or AVIF where possible).
- Defer or lazy-load non-critical scripts.
- Limit canvas draw calls or resolution on low-power devices.
- Prefer system fonts fallback if Google Fonts fail to load.

## Roadmap / Planned Enhancements

- Add dark / light theme toggle.
- Expand project filtering or tagging.
- Integrate a contact form with validation (and optionally a serverless endpoint).
- Replace static skill list with JSON-driven generation.
- Accessibility pass: focus states, reduced motion mode, ARIA labels.

(Adjust or check off items as they are completed.)

## Contributing

This is a personal project, but suggestions and improvements are welcome. Feel free to open an issue or fork and submit a pull request.

## License

If you intend to license the project publicly, add a LICENSE file (e.g. MIT). Until then, assume all rights reserved by the author.

## Contact

Email: [vojtechnovak84@gmail.com](mailto:vojtechnovak84@gmail.com)
GitHub: https://github.com/Vojtik1112
LinkedIn: (add your profile link here)

---

Thanks for visiting the portfolio repository! If you have feedback or opportunities, feel free to reach out.
