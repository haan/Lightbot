/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  function Box(height, x, y) {
    this.height = height;
    this.x = x;
    this.y = y;
    this.reset = function() {};
  }

  lightBot.Box = Box;
})();