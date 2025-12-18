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

The production build in `dist/` is fully static: you can open `dist/index.html` directly in a browser (no server required).

---

## Localizing the downloaded version

Translations live in:

```text
src/locales/translations.js
```

1. Open `src/locales/translations.js` in a text editor.
2. You will see a JavaScript object similar to this:

   ```js
   window.LIGHTBOT_TRANSLATIONS = {
      "title": "LightBot v1.1",
      "controls": {
         "run": "Run",
         "stop": "Stop"
      },
      "welcomeScreen": {
         "start": "Start Game",
         "toggleAudio": "Toggle Audio",
         "help": "Help",
         "achievements": "Achievements"
      }
     // ...
   };
   ```

3. **Do not change the keys** (`menu.play`, `welcome.title`, etc.).  
   Only change the text on the right-hand side to your language. For example:

   ```js
   window.LIGHTBOT_TRANSLATIONS = {
     "menu": {
       "play": "Spielen",
       "options": "Optionen",
       "exit": "Beenden"
     },
     "welcome": {
       "title": "Willkommen bei Lightbot",
       "subtitle": "Lerne, wie ein Programmierer zu denken!"
     }
   };
   ```

4. Save the file.
5. Reload the page (or rebuild). The game interface should now appear in your language.

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
