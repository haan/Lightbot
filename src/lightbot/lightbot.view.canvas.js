/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import { canvasView } from "./lightbot.view.canvas.game.js";

export function initCanvasView() {
  var canvas = document.getElementById("gameCanvas");
  if (!canvas) return null;
  return canvasView(canvas);
}
