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

  lightBot.map.step = step;
})();