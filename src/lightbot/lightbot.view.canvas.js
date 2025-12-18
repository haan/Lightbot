/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import { canvasView } from "./lightbot.view.canvas.game.js";

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  canvasView(canvas);
});
