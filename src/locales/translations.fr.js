// i18n resource table used by i18next. Keys match `data-i18n` / `data-i18n-title` attributes in `index.html`.
export const LIGHTBOT_TRANSLATIONS_FR = {
  "controls": {
    "run": "Exécuter",
    "stop": "Arrêter"
  },
  "welcomeScreen": {
    "start": "Démarrer le jeu",
    "toggleAudio": "Activer/Désactiver l'audio",
    "help": "Aide",
    "achievements": "Succès",
    "language": "Langue"
  },
  "levelSelectScreen": {
    "title": "Sélection du niveau",
    "mainMenu": "Menu principal"
  },
  "achievementsScreen": {
    "title": "Succès",
    "mainMenu": "Menu principal"
  },
  "achievements": {
    "completeLevel": {
      "title": "Terminé",
      "message": "Terminez un niveau."
    },
    "earnGoldMedal": {
      "title": "Fils à maman",
      "message": "Gagnez une médaille d'or."
    },
    "completeLevels5": {
      "title": "Ambitieux",
      "message": "Terminez 5 niveaux."
    },
    "completeLevels10": {
      "title": "Dévoué",
      "message": "Terminez 10 niveaux."
    },
    "completeLevels15": {
      "title": "Accro",
      "message": "Terminez 15 niveaux."
    },
    "completeLevelsBronze": {
      "title": "Nerd",
      "message": "Obtenez des médailles de bronze sur tous les niveaux."
    },
    "completeLevelsSilver": {
      "title": "Élite",
      "message": "Obtenez des médailles d'argent sur tous les niveaux."
    },
    "completeLevelsGold": {
      "title": "H4X0R",
      "message": "Obtenez des médailles d'or sur tous les niveaux."
    }
  },
  "helpScreen": {
    "mainMenu": "Menu principal",
    "goal": {
      "title": "But du jeu",
      "content": "Pour terminer le jeu, vous devez indiquer au robot comment allumer toutes les cases lumineuses d'un niveau. Cependant, votre seul moyen d'interagir avec le robot est d'assembler des instructions dans un programme que le robot peut exécuter."
    },
    "howTo": {
      "title": "Comment jouer",
      "content": "Vous pouvez créer un programme en faisant glisser des instructions depuis la liste et en les déposant dans le cadre du programme. Les instructions seront automatiquement ajoutées en bas du bloc en surbrillance.\nExécutez votre programme en cliquant sur le bouton Exécuter. Si vous n'êtes pas satisfait de votre programme actuel, vous pouvez interrompre l'exécution à tout moment en cliquant sur le bouton Arrêter. Cela réinitialisera le robot à sa position initiale."
    },
    "objects": {
      "title": "Objets du jeu",
      "content": "Un niveau est composé de cases grises ayant une certaine hauteur. Des cases lumineuses spéciales sont dispersées dans le niveau. Ces cases lumineuses peuvent être bleues, ce qui signifie qu'elles sont éteintes, ou jaunes, ce qui signifie qu'elles sont allumées. Si, à un moment donné, toutes les cases lumineuses d'un niveau sont allumées, vous avez terminé ce niveau."
    },
    "walkForward": {
      "title": "Instruction : avancer",
      "content": "En avançant, le robot se déplace d'une case dans la direction vers laquelle il est orienté. Ce mouvement ne sera effectué que si la case vers laquelle il se dirige est de la même hauteur que la case de départ. Dans tout autre cas, le mouvement ne sera pas effectué."
    },
    "turnRight": {
      "title": "Instruction : tourner à droite de 90 degrés",
      "content": "En tournant de 90 degrés vers la droite, le robot reste sur place et pivote de 90 degrés (un quart de tour) vers la droite (dans le sens des aiguilles d'une montre)."
    },
    "turnLeft": {
      "title": "Instruction : tourner à gauche de 90 degrés",
      "content": "En tournant de 90 degrés vers la gauche, le robot reste sur place et pivote de 90 degrés (un quart de tour) vers la gauche (dans le sens inverse des aiguilles d'une montre)."
    },
    "jump": {
      "title": "Instruction : sauter",
      "content": "Le saut est une combinaison d'un déplacement vers l'avant et d'un changement de hauteur. La direction du mouvement est celle vers laquelle le robot est orienté. Un saut vers le haut ne réussit que si la case de destination est plus haute d'exactement une marche que la case de départ. Si la différence de hauteur est supérieure à un, le saut échoue et aucun mouvement n'est effectué. En sautant vers le bas, il n'y a pas de limite à la hauteur depuis laquelle le robot peut sauter. La seule condition est que la différence de hauteur soit d'au moins un."
    },
    "light": {
      "title": "Instruction : éclairer",
      "content": "L'instruction lumière peut être utilisée pour allumer ou éteindre les cases lumineuses. Si le robot se trouve sur une case lumineuse éteinte lorsque l'instruction est exécutée, la case est allumée. En revanche, si le robot se trouve sur une case déjà allumée, elle est éteinte. Si le robot se trouve sur une case normale, rien ne se passe."
    },
    "repeat": {
      "title": "Instruction : répéter",
      "content": "L'instruction répéter est une instruction spéciale qui permet de répéter certaines instructions un certain nombre de fois. L'instruction répéter dispose d'un cadre spécial dans lequel vous pouvez déposer des instructions depuis la liste. Elle possède également un compteur permettant de définir le nombre de répétitions. Il est même possible de placer une instruction répéter à l'intérieur d'une autre, ce qui est essentiel pour créer de très petits programmes."
    },
    "medals": {
      "title": "Médailles",
      "content": "Les médailles sont attribuées lorsque vous terminez des niveaux avec un très petit nombre d'instructions. Parfois, ces petits programmes font exécuter au robot de nombreuses instructions inutiles, ce qui est très inefficace et prend beaucoup de temps. Veuillez noter qu'en informatique, le meilleur programme n'est pas celui qui contient le moins d'instructions, mais celui qui fait exécuter au robot le moins d'instructions."
    },
    "video": {
      "play": "lecture"
    }
  },
  "gameScreen": {
    "back": "Retour",
    "toggleAudio": "Activer/Désactiver l'audio",
    "clear": "Effacer",
    "run": "Exécuter",
    "speed": "Vitesse :"
  },
  "instructions": {
    "title": "Instructions",
    "walk": "Avancer",
    "turnRight": "Tourner à droite de 90 degrés",
    "turnLeft": "Tourner à gauche de 90 degrés",
    "jump": "Sauter",
    "light": "Éclairer",
    "repeat": {
      "label": "Répéter",
      "times": "fois"
    },
    "placeholder": "Déposez vos instructions ici"
  },
  "program": {
    "title": "Programme"
  },
  "dialogs": {
    "levelComplete": {
      "title": "Niveau terminé",
      "message": "Félicitations ! Vous avez terminé ce niveau en utilisant {{count}} instructions !",
      "bronzeMedalHint": "Terminez le niveau avec {{count}} instructions ou moins pour recevoir une médaille de bronze.",
      "silverMedalHint": "Terminez le niveau avec {{count}} instructions ou moins pour recevoir une médaille d'argent.",
      "goldMedalHint": "Terminez le niveau avec {{count}} instructions ou moins pour recevoir une médaille d'or."
    },
    "achievement": {
      "title": "Succès déverrouillé !"
    }
  }
};
