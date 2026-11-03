// i18n resource table used by i18next. Keys match `data-i18n` / `data-i18n-title` attributes in `index.html`.
// Serbian (Latin). Count-based messages use i18next v21+ plural suffixes (_one / _few / _other).
export const LIGHTBOT_TRANSLATIONS_SRB_LAT = {
  "controls": {
    "run": "Pokreni",
    "stop": "Zaustavi"
  },
  "welcomeScreen": {
    "sound": "Zvuk",
    "theme": "Tema",
    "start": "Započni igru",
    "toggleAudio": "Uključi/isključi zvuk",
    "help": "Pomoć",
    "achievements": "Dostignuća",
    "language": "Jezik"
  },
  "levelSelectScreen": {
    "progress": "Završeno: {{completed}} / {{total}}",
    "level": "Nivo {{number}}",
    "incomplete": "Nezavršen",
    "completed": "Završen",
    "bronze": "Bronza",
    "silver": "Srebro",
    "gold": "Zlato",
    "title": "Izbor nivoa",
    "mainMenu": "Glavni meni"
  },
  "achievementsScreen": {
    "progress": "Otključana dostignuća",
    "unlocked": "Otključano",
    "locked": "Zaključano",
    "title": "Dostignuća",
    "mainMenu": "Glavni meni"
  },
  "achievements": {
    "completeLevel": {
      "title": "Završi nivo",
      "message": "Završi jedan nivo."
    },
    "earnGoldMedal": {
      "title": "Svaka čast",
      "message": "Osvoji zlatnu medalju."
    },
    "completeLevels5": {
      "title": "Ambiciozan",
      "message": "Završi 5 nivoa."
    },
    "completeLevels10": {
      "title": "Posvećen",
      "message": "Završi 10 nivoa."
    },
    "completeLevels15": {
      "title": "Zavisnik",
      "message": "Završi 15 nivoa."
    },
    "completeLevelsBronze": {
      "title": "Štreber",
      "message": "Osvoji bronzane medalje na svim nivoima."
    },
    "completeLevelsSilver": {
      "title": "Elita",
      "message": "Osvoji srebrne medalje na svim nivoima."
    },
    "completeLevelsGold": {
      "title": "H4K3R",
      "message": "Osvoji zlatne medalje na svim nivoima."
    }
  },
  "helpScreen": {
    "title": "Kako se igra",
    "topicsTitle": "Teme",
    "topics": {
      "goal": "Cilj igre",
      "howTo": "Sastavi program",
      "objects": "Objekti u igri",
      "walkForward": "Hodaj napred",
      "turnRight": "Okreni se desno",
      "turnLeft": "Okreni se levo",
      "jump": "Skoči",
      "light": "Svetlo",
      "repeat": "Ponovi",
      "medals": "Medalje"
    },
    "mainMenu": "Glavni meni",
    "goal": {
      "title": "Cilj igre",
      "content": "Da bi završio/la igru, moraš da kažeš robotu kako da upali sve svetleće pločice na nivou. Međutim, jedini način da komuniciraš sa robotom jeste da od instrukcija sastaviš program koji robot može da izvrši."
    },
    "howTo": {
      "title": "Kako se igra",
      "content": "Klikni na instrukciju da je dodaš na kraj programa ili je prevuci na željeno mesto, uključujući i unutar bloka Ponovi. Prevlačenjem instrukcija menjaš njihov redosled.\nKlikni na Pokreni da izvršiš program. Isto dugme se zatim menja u Pauza, pa u Nastavi, tako da možeš da pauziraš i nastaviš bez gubljenja mesta. Koristi posebno dugme Resetuj da vratiš robota i svetla u početno stanje i izmeniš program. Resetovanje čuva tvoje instrukcije. Kada se izvršavanje završi, ponovni klik na Pokreni pokreće program ispočetka."
    },
    "objects": {
      "title": "Objekti u igri",
      "content": "Nivo se sastoji od sivih pločica koje imaju određenu visinu. Po nivou su raspoređene posebne svetleće pločice. One mogu biti plave, što znači da nisu upaljene, ili žute, što znači da su upaljene. Ako su u bilo kom trenutku sve svetleće pločice na nivou upaljene, završio/la si taj nivo."
    },
    "walkForward": {
      "title": "Instrukcija: hodaj napred",
      "content": "Kada hoda napred, robot se pomera za jedno polje u smeru u kom je trenutno okrenut. Pomeranje se izvršava samo ako je polje na koje prelazi iste visine kao polje sa kog polazi. U svakom drugom slučaju pomeranje se ne izvršava."
    },
    "turnRight": {
      "title": "Instrukcija: okreni se 90 stepeni udesno",
      "content": "Pri okretanju za 90 stepeni udesno, robot ostaje na mestu i okreće se za 90 stepeni (četvrtinu kruga) udesno (u smeru kazaljke na satu)."
    },
    "turnLeft": {
      "title": "Instrukcija: okreni se 90 stepeni ulevo",
      "content": "Pri okretanju za 90 stepeni ulevo, robot ostaje na mestu i okreće se za 90 stepeni (četvrtinu kruga) ulevo (suprotno od smera kazaljke na satu)."
    },
    "jump": {
      "title": "Instrukcija: skoči",
      "content": "Skok je kombinacija pomeranja napred i promene visine. Robot skače u smeru u kom je okrenut. Skok naviše uspeva samo ako je odredišna pločica viša od početne za tačno jedan stepenik. Ako je razlika u visini veća od jednog, skok ne uspeva i robot se ne pomera. Pri skoku naniže ne postoji ograničenje visine sa koje robot može da skoči. Jedini uslov je da razlika u visini bude najmanje jedan."
    },
    "light": {
      "title": "Instrukcija: svetlo",
      "content": "Instrukcija svetlo služi za paljenje i gašenje svetlećih pločica. Ako se robot nalazi na neupaljenoj svetlećoj pločici kada se izvrši instrukcija svetlo, pločica će se upaliti. Međutim, ako se robot nalazi na već upaljenoj svetlećoj pločici, ta pločica će se ugasiti. Kada se robot nalazi na običnoj pločici, ništa se ne dešava."
    },
    "repeat": {
      "title": "Instrukcija: ponovi",
      "content": "Instrukcija ponovi je posebna instrukcija kojom se neke instrukcije mogu ponoviti određeni broj puta. Ona ima poseban okvir u koji možeš da prevučeš instrukcije sa liste instrukcija. Ima i brojač kojim određuješ koliko puta će se instrukcije unutar nje ponoviti. Moguće je čak staviti instrukciju ponovi unutar druge instrukcije ponovi, što je ključno za pravljenje veoma kratkih programa."
    },
    "medals": {
      "title": "Medalje",
      "content": "Medalje se dodeljuju za završavanje nivoa sa veoma malim brojem instrukcija. Ponekad ovakvi kratki programi teraju robota da izvrši mnogo beskorisnih instrukcija, što je veoma neefikasno i oduzima mnogo vremena. Imaj na umu da u računarstvu najbolji program nije onaj koji sadrži najmanje instrukcija, već onaj zbog kog robot izvrši najmanje instrukcija."
    },
    "video": {
      "play": "pusti"
    }
  },
  "gameScreen": {
    "decreaseRepeat": "Smanji broj ponavljanja",
    "increaseRepeat": "Povećaj broj ponavljanja",
    "status": { "running": "Izvršava se…", "paused": "Pauzirano", "finished": "Završeno" },
    "pause": "Pauza",
    "resume": "Nastavi",
    "runAgain": "Pokreni ponovo",
    "paused": "Pauzirano · Resetuj za izmene",
    "addHint": "Klikni za dodavanje · Prevuci za raspoređivanje",
    "ready": "Spremno za pokretanje",
    "running": "Izvršava se…",
    "finished": "Program je završen · Resetuj za izmene",
    "reset": "Resetuj",
    "remove": "Ukloni instrukciju",
    "commands": {
      "walk": "Napred",
      "turnRight": "Desno",
      "turnLeft": "Levo"
    },
    "back": "Nazad",
    "toggleAudio": "Uključi/isključi zvuk",
    "clear": "Obriši",
    "run": "Pokreni",
    "speed": "Brzina:"
  },
  "instructions": {
    "title": "Instrukcije",
    "walk": "Hodaj napred",
    "turnRight": "Okreni se 90 stepeni udesno",
    "turnLeft": "Okreni se 90 stepeni ulevo",
    "jump": "Skoči",
    "light": "Svetlo",
    "repeat": {
      "label": "Ponovi",
      "times": "puta"
    },
    "placeholder": "Ovde prevuci svoje instrukcije"
  },
  "program": {
    "title": "Program"
  },
  "dialogs": {
    "levelComplete": {
      "title": "Nivo završen",
      "message_one": "Čestitamo! Završio/la si ovaj nivo sa {{count}} instrukcijom!",
      "message_few": "Čestitamo! Završio/la si ovaj nivo sa {{count}} instrukcije!",
      "message_other": "Čestitamo! Završio/la si ovaj nivo sa {{count}} instrukcija!",
      "bronzeMedalHint_one": "Završi nivo sa najviše {{count}} instrukcijom da bi osvojio/la bronzanu medalju.",
      "bronzeMedalHint_few": "Završi nivo sa najviše {{count}} instrukcije da bi osvojio/la bronzanu medalju.",
      "bronzeMedalHint_other": "Završi nivo sa najviše {{count}} instrukcija da bi osvojio/la bronzanu medalju.",
      "silverMedalHint_one": "Završi nivo sa najviše {{count}} instrukcijom da bi osvojio/la srebrnu medalju.",
      "silverMedalHint_few": "Završi nivo sa najviše {{count}} instrukcije da bi osvojio/la srebrnu medalju.",
      "silverMedalHint_other": "Završi nivo sa najviše {{count}} instrukcija da bi osvojio/la srebrnu medalju.",
      "goldMedalHint_one": "Završi nivo sa najviše {{count}} instrukcijom da bi osvojio/la zlatnu medalju.",
      "goldMedalHint_few": "Završi nivo sa najviše {{count}} instrukcije da bi osvojio/la zlatnu medalju.",
      "goldMedalHint_other": "Završi nivo sa najviše {{count}} instrukcija da bi osvojio/la zlatnu medalju."
    },
    "achievement": {
      "title": "Dostignuće otključano!"
    }
  }
};
