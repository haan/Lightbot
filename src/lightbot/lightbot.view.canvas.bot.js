// Bot rendering "view" extension: sprite loading, animation state machine, and drawing.
export function extendBotView(params) {
  if (!params) throw new Error("extendBotView: missing params");
  var app = params.app;
  var bot = params.bot;
  var map = params.map;
  var animations = params.animations;
  var instructions = params.instructions;
  if (!app) throw new Error("extendBotView: missing app");
  if (!bot) throw new Error("extendBotView: missing bot");
  if (!map) throw new Error("extendBotView: missing map");
  if (!animations) throw new Error("extendBotView: missing animations");
  if (!instructions) throw new Error("extendBotView: missing instructions");

  // bot state
  var readyForNextInstruction = true;

  // bot sprites
  var image = new Image();
  image.src = 'img/sprites.png';

  // bot animation
  var currentStep = 0; // # of frames since animation started
  var currentFrame = 0; // current animation frame
  var animation = animations.stand; // current animation
  var movement = {dX: 0, dY: 0, dZ: 0}; // controls bot movement during animations

  function getAnimationDuration() {
    // If speed is 2x, duration is halved. If speed is 0.5x, duration is doubled.
    return animation.duration / app.speedMultiplier;
  }

  function animate(instruction, oldPos, newPos) {
    // set the bot to busy
    readyForNextInstruction = false;

    // decide what to animate
    switch (instruction.name) {
      // walk
      case instructions.WalkInstruction.instructionName:
        setAnimation(animations.walk);
        setMovement((oldPos.x - newPos.x) * map.getMapRef()[oldPos.x][oldPos.y].getEdgeLength(), 0, (oldPos.y - newPos.y) * map.getMapRef()[oldPos.x][oldPos.y].getEdgeLength());
        break;
      // jump
      case instructions.JumpInstruction.instructionName:
        var heightDiff = (map.getMapRef()[newPos.x][newPos.y].getHeight() - map.getMapRef()[oldPos.x][oldPos.y].getHeight()) * map.getMapRef()[newPos.x][newPos.y].getEdgeLength();
        if (heightDiff > 0) {
          setAnimation(animations.jumpUp);
        } else if (heightDiff < 0) {
          setAnimation(animations.jumpDown);
        } else {
          // here we could implement a special animation if the bot can't jump up
          setAnimation(animations.jumpUp);
        }
        setMovement((oldPos.x - newPos.x) * map.getMapRef()[oldPos.x][oldPos.y].getEdgeLength(), heightDiff, (oldPos.y - newPos.y) * map.getMapRef()[oldPos.x][oldPos.y].getEdgeLength());
        break;
      // light
      case instructions.LightInstruction.instructionName:
        setAnimation(animations.light);
        break;
      // turn left, turn right, repeat
      case instructions.TurnLeftInstruction.instructionName:
      case instructions.TurnRightInstruction.instructionName:
      case instructions.RepeatInstruction.instructionName:
        // no animation for turning
        break;
      default:
        console.error('bot view animate: unknown animation "' + instruction.name + '"');
        break;
    }
  }

  function step() {
    if (currentStep >= getAnimationDuration() || !bot.isInExecutionMode()) {
      // set the bot to ready
      readyForNextInstruction = true;

      // set new animation
      setAnimation(animations.stand);
      setMovement(0, 0, 0);

    } else {
      var nbrFrame = Math.floor(currentStep / animation.step);
      if (animation.loop) {
        if (animation.name === 'walk') {
          // walk has special rule since order of frames is 0, 1, 2, 1, 2, 1, 2 ...
          if (nbrFrame < animation.totalFrames) {
            currentFrame = nbrFrame % (animation.totalFrames);
          } else {
            currentFrame = (nbrFrame + 1) % (animation.totalFrames - 1) + 1;
          }
        } else {
          currentFrame = nbrFrame % animation.totalFrames;
        }
      } else {
        currentFrame = Math.min(nbrFrame, animation.totalFrames - 1);
      }
      currentStep++;
    }
  }

  function getMovementOffset() {
    var effectiveDuration = getAnimationDuration();
    var offset = {
      x: currentStep / effectiveDuration * movement.dX,
      y: currentStep / effectiveDuration * movement.dY,
      z: currentStep / effectiveDuration * movement.dZ
    };

    // modify y offset during jump animations for a more natural movement
    if (animation.name === "jumpUp") {
      // jump up y movement is defined by f(x) = x^0.3 from 0 to 1: http://www.wolframalpha.com/input/?i=x%5E0.3+from+0+to+1
      offset.y = Math.pow(currentStep / effectiveDuration, 0.3) * movement.dY;
    }
    if (animation.name === "jumpDown") {
      // jump down y movement is defined by f(x) = x^4 from 0 to 1: http://www.wolframalpha.com/input/?i=f%28x%29+%3D+x%5E4+from+0+to+1
      offset.y = Math.pow(currentStep / effectiveDuration, 4) * movement.dY;
    }
    return offset;
  }

  function draw() {
    var offset = getMovementOffset();

    var p = app.projection.project((this.currentPos.x) * map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength() + (movement.dX - offset.x),
                                        map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() * map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength() + (-movement.dY + offset.y),
                                        (this.currentPos.y) * map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength() + (movement.dZ - offset.z));
    var srcX = animation.sX + currentFrame * animation.width;
    var srcY = this.direction * animation.height;
    var dX = p.x - animation.width / 2; // center image horizontally
    var dY = p.y - animation.height;

    // round dX and dY down to avoid anti-aliasing when drawing the sprite
    app.ctx.drawImage(image, srcX, srcY, animation.width, animation.height, Math.floor(dX), Math.floor(dY), animation.width, animation.height);
  }

  function setAnimation(a) {
    animation = a;
    currentStep = 0;
    currentFrame = 0;
  }

  function getAnimation() {
    return animation;
  }

  function getCurrentStep() {
    return currentStep;
  }

  function getMovement() {
    return movement;
  }

  function setMovement(dX, dY, dZ) {
    movement.dX = dX;
    movement.dY = dY;
    movement.dZ = dZ;
  }

  function isReadyForNextInstruction() {
    return readyForNextInstruction;
  }

  bot.animate = animate;
  bot.step = step;
  bot.draw = draw;
  bot.getAnimation = getAnimation;
  bot.setAnimation = setAnimation;
  bot.getCurrentStep = getCurrentStep;
  bot.getMovement = getMovement;
  bot.setMovement = setMovement;
  bot.isReadyForNextInstruction = isReadyForNextInstruction;

  return bot;
}
