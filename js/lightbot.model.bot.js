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
    }
  };

  lightBot.bot = bot;
})();