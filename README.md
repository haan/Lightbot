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

1. Download the latest release from the Releases page.
2. Unpack the archive.
3. Open `index.html` in your browser (no server required).

---

## Localization

The release build is static, so you cannot add a new localization by editing files after download.
New languages must be added in the source and released as part of the project.

Translations live in:

```text
src/locales/translations.en.js
src/locales/translations.de.js
src/locales/translations.fr.js
```

### Best practice for contributing a new language

1. Copy an existing file (for example `translations.en.js`) to a new file like `translations.it.js`.
2. Translate only the **values** (right-hand side). Keep all keys exactly the same.
3. Add the new language to the i18n resources in `src/lightbot/lightbot.view.canvas.ui.translate.js`.
4. Add the language option to the language selector in `index.html`.
5. Open a Pull Request with the new file.

Only Pull Requests are accepted for new translations.

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

3. **Start the dev server**

   ```bash
   npm run dev
   ```

4. **Build the game**

   ```bash
   npm run build
   ```

   This outputs a production build to `dist/`.

5. **Run locally**

   Open `dist/index.html` in your browser.

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
