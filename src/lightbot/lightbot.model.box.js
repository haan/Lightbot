// Tile type: a regular (non-light) box on the map.

export function createBox() {
  function Box(height, x, y) {
    this.height = height;
    this.x = x;
    this.y = y;
    this.reset = function() {};
  }
  return Box;
}
