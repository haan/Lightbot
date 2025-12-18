// DOM entry point for the canvas renderer; creates the game render loop for `#gameCanvas`.
import { canvasView } from "./lightbot.view.canvas.game.js";

export function initCanvasView(app) {
  var canvas = document.getElementById("gameCanvas");
  if (!canvas) return null;
  return canvasView(app, canvas);
}
