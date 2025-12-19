// i18n resource table used by i18next. Keys match `data-i18n` / `data-i18n-title` attributes in `index.html`.
export const LIGHTBOT_TRANSLATIONS_DE = {
  "controls": {
    "run": "Start",
    "stop": "Stopp"
  },
  "welcomeScreen": {
    "start": "Spiel starten",
    "toggleAudio": "Audio umschalten",
    "help": "Hilfe",
    "achievements": "Erfolge",
    "language": "Sprache"
  },
  "levelSelectScreen": {
    "title": "Levelauswahl",
    "mainMenu": "Hauptmenü"
  },
  "achievementsScreen": {
    "title": "Erfolge",
    "mainMenu": "Hauptmenü"
  },
  "achievements": {
    "completeLevel": {
      "title": "Erledige ihn",
      "message": "Schließe ein Level ab."
    },
    "earnGoldMedal": {
      "title": "Muttersöhnchen",
      "message": "Verdiene eine Goldmedaille."
    },
    "completeLevels5": {
      "title": "Ehrgeizig",
      "message": "Schließe 5 Level ab."
    },
    "completeLevels10": {
      "title": "Engagiert",
      "message": "Schließe 10 Level ab."
    },
    "completeLevels15": {
      "title": "Süchtig",
      "message": "Schließe 15 Level ab."
    },
    "completeLevelsBronze": {
      "title": "Nerd",
      "message": "Verdiene Bronzemedaillen in allen Levels."
    },
    "completeLevelsSilver": {
      "title": "Elite",
      "message": "Verdiene Silbermedaillen in allen Levels."
    },
    "completeLevelsGold": {
      "title": "H4X0R",
      "message": "Verdiene Goldmedaillen in allen Levels."
    }
  },
  "helpScreen": {
    "mainMenu": "Hauptmenü",
    "goal": {
      "title": "Ziel des Spiels",
      "content": "Um das Spiel abzuschließen, musst du dem Roboter sagen, wie er in einem Level alle Leuchtfelder einschaltet. Deine einzige Möglichkeit, mit dem Roboter zu interagieren, besteht jedoch darin, Anweisungen zu einem Programm zusammenzustellen, das der Roboter ausführen kann."
    },
    "howTo": {
      "title": "So spielst du",
      "content": "Du kannst ein Programm erstellen, indem du Anweisungen aus der Anweisungsliste ziehst und in den Programmrahmen ablegst. Die Anweisungen werden automatisch am unteren Ende des markierten Blocks hinzugefügt.\nFühre dein Programm aus, indem du auf die Schaltfläche Start klickst. Wenn du mit deinem aktuellen Programm nicht zufrieden bist, kannst du die Ausführung jederzeit durch Klicken auf die Stopp-Schaltfläche unterbrechen. Dadurch wird der Roboter auf seine Ausgangsposition zurückgesetzt."
    },
    "objects": {
      "title": "Spielobjekte",
      "content": "Ein Level besteht aus grauen Feldern mit einer bestimmten Höhe. Im Level sind spezielle Leuchtfelder verteilt. Diese Leuchtfelder können entweder blau sein, was bedeutet, dass sie unbeleuchtet sind, oder gelb, was bedeutet, dass sie leuchten. Wenn zu irgendeinem Zeitpunkt alle Leuchtfelder in einem Level leuchten, hast du dieses Level abgeschlossen."
    },
    "walkForward": {
      "title": "Anweisung: vorwärts gehen",
      "content": "Beim Vorwärtsgehen rückt der Roboter ein Feld in die Richtung vor, in die er gerade schaut. Diese Bewegung wird nur ausgeführt, wenn das Feld, in das er gehen würde, die gleiche Höhe hat wie das Feld, von dem er startet. In allen anderen Fällen wird die Bewegung nicht ausgeführt."
    },
    "turnRight": {
      "title": "Anweisung: 90 Grad nach rechts drehen",
      "content": "Beim Drehen um 90 Grad nach rechts bleibt der Roboter an Ort und Stelle und dreht sich um 90 Grad (eine Vierteldrehung) nach rechts (im Uhrzeigersinn)."
    },
    "turnLeft": {
      "title": "Anweisung: 90 Grad nach links drehen",
      "content": "Beim Drehen um 90 Grad nach links bleibt der Roboter an Ort und Stelle und dreht sich um 90 Grad (eine Vierteldrehung) nach links (gegen den Uhrzeigersinn)."
    },
    "jump": {
      "title": "Anweisung: Springen",
      "content": "Springen ist eine Kombination aus einem Schritt nach vorn und einer Höhenänderung. Die Richtung der Bewegung entspricht der Richtung, in die der Roboter schaut. Ein Sprung nach oben ist nur erfolgreich, wenn das Zielfeld genau eine Stufe höher ist als das Startfeld. Ist der Höhenunterschied größer als eins, ist der Sprung nicht erfolgreich und es erfolgt keine Bewegung. Beim Herunterspringen gibt es keine Begrenzung für die Höhe, von der der Roboter herunterspringen kann. Die einzige Bedingung ist, dass der Höhenunterschied mindestens eins beträgt."
    },
    "light": {
      "title": "Anweisung: Licht",
      "content": "Die Licht-Anweisung kann verwendet werden, um Leuchtfelder ein- oder auszuschalten. Befindet sich der Roboter auf einem unbeleuchteten Leuchtfeld, wenn die Licht-Anweisung ausgeführt wird, wird das Leuchtfeld eingeschaltet. Befindet sich der Roboter jedoch auf einem bereits leuchtenden Leuchtfeld, wird es ausgeschaltet. Befindet sich der Roboter auf einem normalen Feld, passiert nichts."
    },
    "repeat": {
      "title": "Anweisung: Wiederholen",
      "content": "Die Wiederholungs-Anweisung ist eine spezielle Anweisung, mit der sich einige Anweisungen eine bestimmte Anzahl von Malen wiederholen lassen. Die Wiederholungs-Anweisung hat einen speziellen Rahmen, in den du Anweisungen aus der Anweisungsliste ablegen kannst. Außerdem hat sie einen Zähler, mit dem du festlegen kannst, wie oft die Anweisungen innerhalb der Wiederholung ausgeführt werden. Es ist sogar möglich, eine Wiederholungs-Anweisung innerhalb einer Wiederholungs-Anweisung zu platzieren, was entscheidend ist, um sehr kleine Programme zu erstellen."
    },
    "medals": {
      "title": "Medaillen",
      "content": "Medaillen werden für das Abschließen von Levels mit einer sehr kleinen Anzahl von Anweisungen vergeben. Manchmal lassen diese kleinen Programme den Roboter viele nutzlose Anweisungen ausführen, was sehr ineffizient ist und viel Zeit kostet. Bitte beachte, dass in der Informatik das beste Programm nicht dasjenige ist, das die wenigsten Anweisungen enthält, sondern dasjenige, bei dem der Roboter die wenigsten Anweisungen ausführt."
    },
    "video": {
      "play": "abspielen"
    }
  },
  "gameScreen": {
    "back": "Zurück",
    "toggleAudio": "Audio umschalten",
    "clear": "Leeren",
    "run": "Start",
    "speed": "Geschwindigkeit:"
  },
  "instructions": {
    "title": "Anweisungen",
    "walk": "Vorwärts gehen",
    "turnRight": "90 Grad nach rechts drehen",
    "turnLeft": "90 Grad nach links drehen",
    "jump": "Springen",
    "light": "Licht",
    "repeat": {
      "label": "Wiederholen",
      "times": "mal"
    },
    "placeholder": "Lege deine Anweisungen hier ab"
  },
  "program": {
    "title": "Programm"
  },
  "dialogs": {
    "levelComplete": {
      "title": "Level abgeschlossen",
      "message": "Glückwunsch! Du hast dieses Level mit {{count}} Anweisungen abgeschlossen!",
      "bronzeMedalHint": "Schließe das Level mit {{count}} Anweisungen oder weniger ab, um eine Bronzemedaille zu erhalten.",
      "silverMedalHint": "Schließe das Level mit {{count}} Anweisungen oder weniger ab, um eine Silbermedaille zu erhalten.",
      "goldMedalHint": "Schließe das Level mit {{count}} Anweisungen oder weniger ab, um eine Goldmedaille zu erhalten."
    },
    "achievement": {
      "title": "Erfolg freigeschaltet!"
    }
  }
};
