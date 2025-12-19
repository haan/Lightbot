// i18n resource table used by i18next. Keys match `data-i18n` / `data-i18n-title` attributes in `index.html`.
export const LIGHTBOT_TRANSLATIONS_EN = {
  "controls": {
    "run": "Run",
    "stop": "Stop"
  },
  "welcomeScreen": {
    "start": "Start Game",
    "toggleAudio": "Toggle Audio",
    "help": "Help",
    "achievements": "Achievements",
    "language": "Language"
  },
  "levelSelectScreen": {
    "title": "Level select",
    "mainMenu": "Main Menu"
  },
  "achievementsScreen": {
    "title": "Achievements",
    "mainMenu": "Main Menu"
  },
  "achievements": {
    "completeLevel": {
      "title": "Finish Him",
      "message": "Complete a level."
    },
    "earnGoldMedal": {
      "title": "Momma's Boy",
      "message": "Earn a gold medal."
    },
    "completeLevels5": {
      "title": "Ambitious",
      "message": "Complete 5 levels."
    },
    "completeLevels10": {
      "title": "Dedicated",
      "message": "Complete 10 levels."
    },
    "completeLevels15": {
      "title": "Addicted",
      "message": "Complete 15 levels."
    },
    "completeLevelsBronze": {
      "title": "Nerd",
      "message": "Earn bronze medals on all levels."
    },
    "completeLevelsSilver": {
      "title": "Elite",
      "message": "Earn silver medals on all levels."
    },
    "completeLevelsGold": {
      "title": "H4X0R",
      "message": "Earn gold medals on all levels."
    }
  },
  "helpScreen": {
    "mainMenu": "Main Menu",
    "goal": {
      "title": "Goal of the game",
      "content": "In order to complete the game, you have to tell the robot how to light up all the light tiles in a given level. However, your only way of interacting with the robot is by assembling instructions into a program that the robot can execute."
    },
    "howTo": {
      "title": "How to play the game",
      "content": "You can create a program by dragging instructions from the instruction list and dropping them into the program frame. The instructions will automatically be added to the bottom of the highlighted block.\nExecute your program by clicking the Run button. If you are not satisfied with your current program, you can interrupt the execution at any moment by clicking the Stop button. This will reset the robot to his initial position."
    },
    "objects": {
      "title": "Game objects",
      "content": "A level is made up from gray tiles which have a certain height. Special light tiles are scattered throughout the level. These light tiles can either be blue, which means that they are unlit, or they can be yellow, which means that they are lit. If at any given moment, all the light tiles in a level are lit, you have completed that level."
    },
    "walkForward": {
      "title": "Instruction: walk forward",
      "content": "When walking forward, the robot will advance one square in the direction it is currently facing. This movement will only be performed if the space it would be heading into is of the same height as the square it is moving out from. In any other case the movement will not be performed."
    },
    "turnRight": {
      "title": "Instruction: Turn 90 degrees to the right",
      "content": "When turning 90 degrees to the right, the robot will stay in place and turn 90 degrees (a quarter turn) to the right (clockwise)."
    },
    "turnLeft": {
      "title": "Instruction: Turn 90 degrees to the left",
      "content": "When turning 90 degrees to the left, the robot will stay in place and turn 90 degrees (a quarter turn) to the left (anti-clockwise)."
    },
    "jump": {
      "title": "Instruction: Jump",
      "content": "Jumping is a combination of a move forward and a change in height. The direction of the movement is in the direction that the robot is facing. An upward jump is only successful if the destination tile is higher by exactly one step than the starting tile. If the height difference is bigger than one, the jump is not successful and no movement is performed. When jumping down, there is no limit to the height the robot can jump down from. The only condition is that the difference in height is at least one."
    },
    "light": {
      "title": "Instruction: Light",
      "content": "The light instruction can be used to toggle light tiles on or off. If the robot is located on an unlit light tile when the light instruction is executed, the light tile will be toggled on. However, if the robot is located on an already lit light tile, that light tile will be toggled off. When the robot is located on a normal tile, nothing happens."
    },
    "repeat": {
      "title": "Instruction: Repeat",
      "content": "The repeat instruction is a special instruction that can be used to repeat some instructions a certain number of times. The repeat instruction has a special frame where you can drop instructions from the instruction list. It also has a counter where you can define the number of times the instructions within the repeat instruction will be repeated. It is even possible to place a repeat instruction within a repeat instruction, which is essential for creating very small programs."
    },
    "medals": {
      "title": "Medals",
      "content": "Medals are rewarded for completing levels with only a very small amount of instructions. Sometimes, these small programs make the robot execute a lot of useless instructions, which is very inefficient and takes a lot of time. Please be aware that in computer science, the best program is not the one that contains the least amount of instructions but the one that has the robot execute the least amount of instructions."
    },
    "video": {
      "play": "play"
    }
  },
  "gameScreen": {
    "back": "Back",
    "toggleAudio": "Toggle Audio",
    "clear": "Clear",
    "run": "Run",
    "speed": "Speed:"
  },
  "instructions": {
    "title": "Instructions",
    "walk": "Walk forward",
    "turnRight": "Turn 90 degrees to the right",
    "turnLeft": "Turn 90 degrees to the left",
    "jump": "Jump",
    "light": "Light",
    "repeat": {
      "label": "Repeat",
      "times": "times"
    },
    "placeholder": "Drop your instructions here"
  },
  "program": {
    "title": "Program"
  },
  "dialogs": {
    "levelComplete": {
      "title": "Level complete",
      "message": "Congratulations! You have completed this level using {{count}} instructions!",
      "bronzeMedalHint": "Complete the level with {{count}} instructions or less to receive a bronze medal.",
      "silverMedalHint": "Complete the level with {{count}} instructions or less to receive a silver medal.",
      "goldMedalHint": "Complete the level with {{count}} instructions or less to receive a gold medal."
    },
    "achievement": {
      "title": "Achievement unlocked!"
    }
  }
};
