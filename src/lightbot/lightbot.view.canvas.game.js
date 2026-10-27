// Canvas renderer + main simulation tick (60fps); drives `app.step()` and `app.draw()`.
import { getMapFrame } from "./lightbot.view.canvas.projection.js";
export function canvasView(app, canvas) {
  var lightBot = app;
  // set the rendering context
  lightBot.ctx = canvas.getContext('2d');
  // Keep world coordinates fixed while giving the canvas enough physical pixels.
  var sceneWidth = canvas.width;
  var sceneHeight = canvas.height;

  // refresh rate and rendering loop
  var fps = 60;
  var fpsDelay = 1000 / fps;
  var renderTimer = null;

  // distance between lowest point in the map and the bottom edge
  var offsetY = 100;

  // create projection
  lightBot.projection = new lightBot.Projection(sceneHeight, sceneWidth / 2, offsetY);

  var framedMap = null;
  var frame = null;

  function update() {
    if (lightBot.bot.isPaused()) return;
    // check if we can execute the next bot instruction here?
    if (lightBot.bot.isInExecutionMode() && lightBot.bot.isReadyForNextInstruction() && lightBot.bot.hasNextInstruction()) {
      var oldPos = Object.assign({}, lightBot.bot.currentPos); // copy old position
      var instruction = lightBot.bot.executeNextInstruction();
      var newPos = lightBot.bot.currentPos; // get the new position
      if (instruction) {
        lightBot.bot.animate(instruction, oldPos, newPos);
        lightBot.ui.onInstruction(instruction);
      }
    }
    // check if map has been completed here
    if (lightBot.map.ready() && lightBot.map.state.allLightsOn()) {

      // stop the bot
      lightBot.bot.clearExecutionQueue();

      // award medals
      var medal = lightBot.medals.awardMedal();
      lightBot.medals.display(medal); // show medal dialog

      // award achievements
      var achievements = lightBot.achievements.awardAchievements();
      lightBot.achievements.display(achievements);

      // set the map as complete
      lightBot.map.complete();

      // return to map selection screen
    }
    lightBot.step();
    if (lightBot.bot.isInExecutionMode() && !lightBot.bot.hasNextInstruction() && lightBot.bot.isReadyForNextInstruction()) {
      lightBot.ui.onProgramFinished();
    }
    lightBot.draw();
  }

  function step() {
    lightBot.bot.step();
    lightBot.map.step();
  }

  function draw() {
    var pixelRatio = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    var backingWidth = Math.round(sceneWidth * pixelRatio);
    var backingHeight = Math.round(sceneHeight * pixelRatio);
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
    }
    lightBot.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    //clear main canvas
    lightBot.ctx.clearRect(0, 0, sceneWidth, sceneHeight);

    // The CSS surface follows the selected theme; the transparent canvas only draws the puzzle.
    if (!lightBot.map.getMapRef()) return;
    if (framedMap !== lightBot.map.getMapRef()) {
      framedMap = lightBot.map.getMapRef();
      frame = getMapFrame(lightBot.map, lightBot.projection, sceneWidth, sceneHeight);
    }
    lightBot.ctx.save();
    lightBot.ctx.translate(frame.x, frame.y);
    lightBot.ctx.scale(frame.scale, frame.scale);

    // draw the map and the bot in the correct order
    switch (lightBot.bot.direction) {
      case lightBot.directions.se:
        for (var i = lightBot.map.getLevelSize().x - 1; i >= 0; i--) {
          for (var j = lightBot.map.getLevelSize().y - 1; j >= 0; j--) {
            lightBot.map.getMapRef()[i][j].draw();
            if (lightBot.bot.currentPos.x === i && lightBot.bot.currentPos.y === j) {
              lightBot.bot.draw();
            }
          }
        }
        break;
      case lightBot.directions.nw:
        for (i = lightBot.map.getLevelSize().x - 1; i >= 0; i--) {
          for (j = lightBot.map.getLevelSize().y - 1; j >= 0; j--) {
            lightBot.map.getMapRef()[i][j].draw();
            switch (lightBot.bot.getAnimation().name) {
              case lightBot.bot.animations.jumpUp.name:
              case lightBot.bot.animations.jumpDown.name:
                if (lightBot.bot.getMovement().dZ !== 0 && lightBot.bot.getCurrentStep() / lightBot.bot.getAnimation().duration <= 0.5) {
                  if (lightBot.bot.currentPos.x === i && lightBot.bot.currentPos.y === j+1) {
                    lightBot.bot.draw();
                  }
                } else {
                  if (lightBot.bot.currentPos.x === i && lightBot.bot.currentPos.y === j) {
                    lightBot.bot.draw();
                  }
                }
                break;
              case lightBot.bot.animations.walk.name:
                if (lightBot.bot.getMovement().dZ !== 0 && lightBot.bot.currentPos.x === i && lightBot.bot.currentPos.y === j+1) {
                  lightBot.bot.draw();
                } else if (lightBot.bot.currentPos.x === i && lightBot.bot.currentPos.y === j) {
                  lightBot.bot.draw();
                }
                break;
              default:
                if (lightBot.bot.currentPos.x === i && lightBot.bot.currentPos.y === j) {
                  lightBot.bot.draw();
                }
                break;
            }
          }
        }
        break;
      case lightBot.directions.ne:
        for (i = lightBot.map.getLevelSize().y - 1; i >= 0; i--) {
          for (j = lightBot.map.getLevelSize().x - 1; j >= 0; j--) {
            lightBot.map.getMapRef()[j][i].draw();
            switch (lightBot.bot.getAnimation().name) {
              case lightBot.bot.animations.jumpUp.name:
              case lightBot.bot.animations.jumpDown.name:
                if (lightBot.bot.getMovement().dX !== 0 && lightBot.bot.getCurrentStep() / lightBot.bot.getAnimation().duration <= 0.5) {
                  if (lightBot.bot.currentPos.x === j+1 && lightBot.bot.currentPos.y === i) {
                    lightBot.bot.draw();
                  }
                } else {
                  if (lightBot.bot.currentPos.x === j && lightBot.bot.currentPos.y === i) {
                    lightBot.bot.draw();
                  }
                }
                break;
              case lightBot.bot.animations.walk.name:
                if (lightBot.bot.getMovement().dX !== 0 && lightBot.bot.currentPos.x === j+1 && lightBot.bot.currentPos.y === i) {
                  lightBot.bot.draw();
                } else if (lightBot.bot.currentPos.x === j && lightBot.bot.currentPos.y === i) {
                  lightBot.bot.draw();
                }
                break;
              default:
                if (lightBot.bot.currentPos.x === j && lightBot.bot.currentPos.y === i) {
                  lightBot.bot.draw();
                }
                break;
            }
          }
        }
        break;
      case lightBot.directions.sw:
        for (i = lightBot.map.getLevelSize().y - 1; i >= 0; i--) {
          for (j = lightBot.map.getLevelSize().x - 1; j >= 0; j--) {
            lightBot.map.getMapRef()[j][i].draw();
            if (lightBot.bot.currentPos.x === j && lightBot.bot.currentPos.y === i) {
              lightBot.bot.draw();
            }
          }
        }
        break;
      default:
        console.error('canvasView draw: unknown direction "' + lightBot.bot.direction + '"');
        break;
    }
    lightBot.ctx.restore();
  }


  lightBot.step = step;
  lightBot.draw = draw;

  function stop() {
    if (renderTimer == null) return;
    window.clearInterval(renderTimer);
    renderTimer = null;
  }

  function start() {
    if (renderTimer != null) return;
    renderTimer = window.setInterval(update, fpsDelay);
  }

  return {
    stop: stop,
    start: start
  };
};
