// Map rendering "view" extension: provides `map.step()` to tick all tiles each frame.
export function extendMapView(map) {
  function step() {
    for (var i = 0; i < map.getLevelSize().x; i++) {
      for (var j = 0; j < map.getLevelSize().y; j++) {
        // update the tile
        map.getMapRef()[i][j].step();
      }
    }
  }

  map.step = step;
  return map;
}
