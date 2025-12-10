# Lightbot

Lightbot is an educational puzzle game about programming and logical thinking.

The player controls a small robot and must guide it to light up all blue tiles in each level.  
Instead of moving the robot directly, you build a **program** from simple instructions  
(move, turn, jump, light up, repeat, etc.). This makes Lightbot well-suited for
introductory courses on algorithms, control flow, and problem decomposition.

---

## Play online

You can play Lightbot directly in your browser:

- https://lightbot.lu

No installation or account is required for the online version.

---

## Downloading and running Lightbot locally

The repository used to contain a committed `deploy` folder with a ready-to-run build.  
That folder is now treated as a **build artifact** and is no longer tracked in Git.

To get a downloadable, offline version:

1. Go to the **Releases** page of this repository on GitHub.
2. Download the latest Lightbot release archive (ZIP).
3. Extract the ZIP file.
4. Open `index.html` from the extracted folder in a modern web browser  
   (Chrome, Firefox, Edge, Safari).

Lightbot is a fully static web app: you only need to open `index.html`.  
No web server or backend is required.

---

## Building from source

If you prefer to build the game yourself (or modify the code):

1. **Clone the repository**

   ```bash
   git clone https://github.com/haan/Lightbot.git
   cd Lightbot
   ```

2. **Install dependencies**

   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install
   ```

3. **Build the game**

   ```bash
   npm run build
   ```

   This will:

   - Minify and bundle the JavaScript into `deploy/js/lightbot.min.js`
   - Minify the CSS into `deploy/css/lightbot.min.css`
   - Copy images, audio and other assets into `deploy/`
   - Copy the production `index.html` into `deploy/index.html`

4. **Run locally**

   Open:

   ```text
   deploy/index.html
   ```

   in your browser to play the game from your local build.

---

## Using Lightbot in teaching

Lightbot was designed with teaching in mind. Typical use cases include:

- Introducing **basic programming concepts** (sequencing, loops, conditionals)
- Practicing **algorithmic thinking** and planning
- Comparing different solutions for **efficiency** (shorter programs vs. more steps)

Teachers are free to:

- Run the online version in class
- Provide a local copy built from the Releases page
- Fork the repository and customize levels and interface to their needs

---

## Credits

- Development: Laurent Haan  
- Interface: Zenobia Homan  
- Robot artwork: surt  
- Music: hektikmusic  
- Original Lightbot concept: https://lightbot.com/

---

## License

This project is released under the **MIT License**.  
See the [`LICENSE`](LICENSE) file for the full license text.
