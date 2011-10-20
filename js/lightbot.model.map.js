/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var map = {};

  var levelSize = {'x': 0, 'y': 0}; // the level size
  var mapRef = null; // the actual map values
  var medals = null; // medals for the level
  var levelNumber = 0; // what level is the user currently playing

  map.loadMap = function(data) { //TODO: change data to levelNumber and store maps locally

    // set the bot starting direction
    lightBot.bot.init(data.direction, data.position);

    // set the level medals
    medals = data.medals;

    // map files are defined user-friendly so we have to adapt to that
    levelSize.x = data.map[0].length; // we suppose map is a rectangle
    levelSize.y = data.map.length;

    mapRef = new Array(levelSize.x);
    for (i = 0; i < levelSize.x; i++) {
      mapRef[i] = new Array(levelSize.y);
    }

    var botInMap = false;
    var nbrLights = 0;

    for (var i = 0; i < data.map.length; i++){
      for (var j = 0; j < data.map[i].length; j++) {
        switch (data.map[i][j].t) {
          case 'b':
            mapRef[j][data.map.length - i - 1] = new lightBot.Box(data.map[i][j].h, j, data.map.length - i - 1);
            break;
          case 'l':
            mapRef[j][data.map.length - i - 1] = new lightBot.LightBox(data.map[i][j].h, j, data.map.length - i - 1);
            nbrLights++;
            break;
          default:
            // output error and fall back to box element
            console.error('Map contains unsupported element: ' + data.map[i][j].t);
            mapRef[j][data.map.length - i - 1] = new lightBot.Box(data.map[i][j].h, j, data.map.length - i - 1);
            break;
        }
      }
    }

    if (nbrLights === 0) {
      console.error('No light defined in map');
    }
  };

  map.reset = function() {
    lightBot.bot.reset();
    for (var i = 0; i < levelSize.x; i++) {
      for (var j = 0; j < levelSize.y; j++) {
        mapRef[i][j].reset();
      }
    }
  };

  /* getters and setters */
  map.getLevelSize = function() {
    return levelSize;
  };

  map.getMapRef = function() {
    return mapRef;
  };

  map.getMedals = function() {
    return medals;
  };

  map.getLevelNumber = function() {
    return levelNumber;
  };

  map.getNbrOfLevels = function() { // TODO: implement this
    return 15;
  };

  lightBot.map = map;
})();