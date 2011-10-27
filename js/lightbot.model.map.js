/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var map = {};

  var maps = null; // storage for all the maps loaded from the server

  var levelSize = {'x': 0, 'y': 0}; // the level size
  var mapRef = null; // the actual map values
  var medals = null; // medals for the level
  var levelNumber = null; // what level is the user currently playing

  map.loadMaps = function() {
    $.getJSON('maps/maps.txt', function(data){
      maps = data;
    });
  };

  map.loadMap = function(x) {
    if (!maps) {
      console.error('Map list is empty');
    } else {
      // set the level number
      levelNumber = x;

      // set the bot starting direction
      lightBot.bot.init(maps[x].direction, maps[x].position);

      // set the level medals
      medals = maps[x].medals;

      // map files are defined user-friendly so we have to adapt to that
      levelSize.x = maps[x].map[0].length; // we suppose map is a rectangle
      levelSize.y = maps[x].map.length;

      mapRef = new Array(levelSize.x);
      for (i = 0; i < levelSize.x; i++) {
        mapRef[i] = new Array(levelSize.y);
      }

      var botInMap = false;
      var nbrLights = 0;

      for (var i = 0; i < maps[x].map.length; i++){
        for (var j = 0; j < maps[x].map[i].length; j++) {
          switch (maps[x].map[i][j].t) {
            case 'b':
              mapRef[j][maps[x].map.length - i - 1] = new lightBot.Box(maps[x].map[i][j].h, j, maps[x].map.length - i - 1);
              break;
            case 'l':
              mapRef[j][maps[x].map.length - i - 1] = new lightBot.LightBox(maps[x].map[i][j].h, j, maps[x].map.length - i - 1);
              nbrLights++;
              break;
            default:
              // output error and fall back to box element
              console.error('Map contains unsupported element: ' + maps[x].map[i][j].t);
              mapRef[j][maps.map.length - i - 1] = new lightBot.Box(maps[x].map[i][j].h, j, maps[x].map.length - i - 1);
              break;
          }
        }
      }

      if (nbrLights === 0) {
        console.error('No light defined in map');
      }
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
  map.ready = function() {
    return levelNumber !== null;
  };

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

  map.getNbrOfLevels = function() {
    return maps.length;
  };

  map.complete = function() {
    levelNumber = null; // by setting levelNumber to null, the map is marked as completed
  };

  lightBot.map = map;
})();