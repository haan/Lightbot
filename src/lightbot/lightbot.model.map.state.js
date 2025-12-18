/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var state = {
    allLightsOn: function() {
      for (var i = 0; i < lightBot.map.getLevelSize().x; i++) {
        for (var j = 0; j < lightBot.map.getLevelSize().y; j++) {
          if (lightBot.map.getMapRef()[i][j] instanceof lightBot.LightBox && !lightBot.map.getMapRef()[i][j].lightOn) {
            return false;
          }
        }
      }
      return true;
    },
    check: function(functionToCheck) {
      return functionToCheck();
    }
  };

  lightBot.map.state = state;
})();