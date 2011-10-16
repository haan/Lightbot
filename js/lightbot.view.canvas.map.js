/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {

  function step() {
    for (var i = 0; i < lightBot.map.getLevelSize().x; i++) {
      for (var j = 0; j < lightBot.map.getLevelSize().y; j++) {
        // update the tile
        lightBot.map.getMapRef()[i][j].step();
      }
    }
  }

  /*
  function draw() {
    for (var i = lightBot.map.getLevelSize().x - 1; i >= 0; i--) {
      for (var j = lightBot.map.getLevelSize().y - 1; j >= 0; j--) {
        // draw the tile
        lightBot.map.getMapRef()[i][j].draw();
      }
    }

    // draw the bot
    lightBot.bot.draw();
  }
  */

  lightBot.map.step = step;
  //lightBot.map.draw = draw;
})();