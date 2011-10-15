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
    // executes and returns the next instruction
    executeNextInstruction: function() {
      // TODO instruction objects and returns!
      this.light();
      return 'light';
    },
    walk: function() {
      switch (this.direction) {
        case lightBot.directions.se:
          if (this.currentPos.y > 0 && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() === lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y-1].getHeight()) {
            this.currentPos.y--;
          }
          break;
        case lightBot.directions.ne:
          if (this.currentPos.x+1 < lightBot.map.getLevelSize().x && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() === lightBot.map.getMapRef()[this.currentPos.x+1][this.currentPos.y].getHeight()) {
            this.currentPos.x++;
          }
          break;
        case lightBot.directions.nw:
          if (this.currentPos.y+1 < lightBot.map.getLevelSize().y && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() === lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y+1].getHeight()) {
            this.currentPos.y++;
          }
          break;
        case lightBot.directions.sw:
          if (this.currentPos.x > 0 && lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() === lightBot.map.getMapRef()[this.currentPos.x-1][this.currentPos.y].getHeight()) {
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
    },
    jump: function() {
      
    }
  };

  lightBot.bot = bot;
})();