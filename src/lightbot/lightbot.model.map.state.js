// Map state checks (win condition helpers, etc.).

export function createMapState(params) {
  if (!params) throw new Error("createMapState: missing params");
  var map = params.map;
  var LightBox = params.LightBox;
  if (!map) throw new Error("createMapState: missing map");
  if (!LightBox) throw new Error("createMapState: missing LightBox");

  var state = {
    allLightsOn: function() {
      for (var i = 0; i < map.getLevelSize().x; i++) {
        for (var j = 0; j < map.getLevelSize().y; j++) {
          if (map.getMapRef()[i][j] instanceof LightBox && !map.getMapRef()[i][j].lightOn) {
            return false;
          }
        }
      }
      return true;
    }
  };

  return state;
}
