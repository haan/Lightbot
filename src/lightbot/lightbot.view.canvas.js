// DOM entry point for the canvas renderer; creates the game render loop for `#gameCanvas`.
import { canvasView } from "./lightbot.view.canvas.game.js";

export function initCanvasView(app) {
  var canvas = document.getElementById("gameCanvas");
  if (!canvas) return null;
  var renderLoop = canvasView(app, canvas);
  if (app) app.renderLoop = renderLoop;
  if (app && app.ui) app.ui.renderLoop = renderLoop;
  return renderLoop;
}
