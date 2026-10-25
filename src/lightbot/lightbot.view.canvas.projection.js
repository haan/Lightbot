// Isometric projection used by box/tile drawing on the canvas.
export function Projection(canvasHeight, offsetX, offsetY) {
  this.project = function(x, y, z) {
      /*
        Math: http://en.wikipedia.org/wiki/Isometric_projection#Overview
        More Theory: http://www.compuphase.com/axometr.htm
        Angles used: vertical rotation=45°, horizontal rotation=arctan(0,5)
        projection matrix:
        | 0,707  0     -0,707 |
        | 0,321  0,891  0,321 |
        | 0,630 -0,453  0,630 |

        Additional offset!
        Y Axis is inverted.
       */
    return {'x': offsetX + 0.707*x - 0.707*z, 'y': canvasHeight - (offsetY + 0.321*x + 0.891*y + 0.321*z)};
  };
}

// Fit the entire level, with room above every tile for the robot sprite.
// Framing depends on the level geometry, so it stays still while the robot moves.
export function getMapFrame(map, projection, width, height) {
  var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  map.getMapRef().forEach(function (column) {
    column.forEach(function (tile) {
      var edge = tile.getEdgeLength();
      [tile.x, tile.x + 1].forEach(function (x) {
        [tile.y, tile.y + 1].forEach(function (y) {
          [0, tile.getHeight() * edge].forEach(function (z) {
            var point = projection.project(x * edge, z, y * edge);
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y - 70);
            maxY = Math.max(maxY, point.y);
          });
        });
      });
    });
  });
  var scale = Math.min(1, (width - 48) / (maxX - minX), (height - 48) / (maxY - minY));
  return {
    scale: scale,
    x: (width - (minX + maxX) * scale) / 2,
    y: (height - (minY + maxY) * scale) / 2,
  };
}
