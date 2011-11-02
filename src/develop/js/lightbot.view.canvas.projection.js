/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  function Projection(canvasHeight, offsetX, offsetY) {
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

  lightBot.Projection = Projection;
})();