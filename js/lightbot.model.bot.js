/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var bot = {
    startingPos: {x: 0, y: 0}, // save initial position for reset
    currentPos: {x: 0, y: 0}, // current bot position on the map
    startingDirection: lightBot.directions.se, // save initial direction for reset
    direction: lightBot.directions.se,
    instructionQueue: [],
    init: function(direction, position) {
      this.startingPos = position;
      this.currentPos = position;
      this.startingDirection = direction;
      this.direction = direction;
    },
    reset: function() {
      this.currentPos = this.startingPos;
      this.direction = this.startingDirection;
    },
    queueInstruction: function(instruction) {
      this.instructionQueue.push(instruction);
    },
    hasNextInstruction: function() {
      return (this.instructionQueue.length > 0);
    },
    // executes and returns the next instruction
    executeNextInstruction: function() {
      if (this.instructionQueue.length > 0) {
        var instruction = this.instructionQueue.shift();
        switch (instruction.name) {
          case lightBot.bot.instructions.WalkInstruction.instructionName:
            this.walk();
            break;
          case lightBot.bot.instructions.JumpInstruction.instructionName:
            this.jump();
            break;
          case lightBot.bot.instructions.LightInstruction.instructionName:
            this.light();
            break;
          case lightBot.bot.instructions.TurnLeftInstruction.instructionName:
            this.turnLeft();
            break;
          case lightBot.bot.instructions.TurnRightInstruction.instructionName:
            this.turnRight();
            break;
          case lightBot.bot.instructions.RepeatInstruction.instructionName:
            if (instruction.counter > 1) {
              instruction.counter--;
              this.instructionQueue.unshift(instruction);
            }
            for (var i = instruction.body.length - 1; i >= 0 ; i--) {
              var tmp = instruction.body[i];
              var tmp2 = jQuery.extend(true, {}, tmp); // deep copy of object as explained here: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
              this.instructionQueue.unshift(tmp2);
            }
            break;
          default:
            console.error('Bot executeNextInstruction: unknown instruction "' + instruction.name + '"');
            break;
        }
        return instruction;
      } else {
        console.error('Bot executeNextInstruction: no instruction to execute');
        return null;
      }
    },
    walk: function() {
      switch (this.direction) {
        case lightBot.directions.se:
          if (this.currentPos.y > 0 && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y-1].height) {
            this.currentPos.y--;
          }
          break;
        case lightBot.directions.ne:
          if (this.currentPos.x+1 < lightBot.map.getLevelSize().x && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === lightBot.map.getMapRef()[this.currentPos.x+1][this.currentPos.y].height) {
            this.currentPos.x++;
          }
          break;
        case lightBot.directions.nw:
          if (this.currentPos.y+1 < lightBot.map.getLevelSize().y && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y+1].height) {
            this.currentPos.y++;
          }
          break;
        case lightBot.directions.sw:
          if (this.currentPos.x > 0 && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === lightBot.map.getMapRef()[this.currentPos.x-1][this.currentPos.y].height) {
            this.currentPos.x--;
          }
          break;
        default:
          console.error('Bot walk: unknown direction "' + this.direction + '"');
          break;
      }
    },
    jump: function() {
      switch (this.direction) {
        case lightBot.directions.se:
          if (this.currentPos.y > 0 && (lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y-1].height - lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height > lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y-1].height)) {
            this.currentPos.y--;
          }
          break;
        case lightBot.directions.ne:
          if (this.currentPos.x+1 < lightBot.map.getLevelSize().x && (lightBot.map.getMapRef()[this.currentPos.x+1][this.currentPos.y].height - lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height > lightBot.map.getMapRef()[this.currentPos.x+1][this.currentPos.y].height)) {
            this.currentPos.x++;
          }
          break;
        case lightBot.directions.nw:
          if (this.currentPos.y+1 < lightBot.map.getLevelSize().y && (lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y+1].height - lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height > lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y+1].height)) {
            this.currentPos.y++;
          }
          break;
        case lightBot.directions.sw:
          if (this.currentPos.x > 0 && lightBot.map.getLevelSize().x && (lightBot.map.getMapRef()[this.currentPos.x-1][this.currentPos.y].height - lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].height > lightBot.map.getMapRef()[this.currentPos.x-1][this.currentPos.y].height)) {
            this.currentPos.x--;
          }
          break;
        default:
          console.error('Bot is facing unknown direction');
          break;
      }
    },
    light: function() {
      var tmp = lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y];
      if (tmp instanceof lightBot.LightBox) {
        tmp.toggleLight();
      }
    },
    turnLeft: function() {
      this.direction = (this.direction+1) % 4;
    },
    turnRight: function() {
      this.direction--;
      if (this.direction < 0) {
        this.direction = 3;
      }
    }
  };

  lightBot.bot = bot;
})();