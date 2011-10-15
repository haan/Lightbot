(function() {
  // bot state
  var readyForNextInstruction = true;

  // bot sprites
  var image = new Image();
  image.src = 'img/sprites.png';

  // bot animation
  var currentStep = 0; // # of frames since animation started
  var currentFrame = 0; // current animation frame
  var animation = lightBot.bot.animations.stand; // current animation
  var movement = {dX: 0, dY: 0, dZ: 0}; // controls bot movement during animations

  function animate(instruction, oldPos, newPos) {
    // set the bot to busy
    readyForNextInstruction = false;

    // decide what to animate
    switch (instruction) {
      case 'walk':
        setAnimation(lightBot.bot.animations.walk);
        setMovement((oldPos.x - newPos.x) * lightBot.map.getMapRef()[oldPos.x][oldPos.y].getEdgeLength(), 0, (oldPos.y - newPos.y) * lightBot.map.getMapRef()[oldPos.x][oldPos.y].getEdgeLength());
        break;
      case 'light':
        setAnimation(lightBot.bot.animations.light);
        break;
      case 'turnLeft':
      case 'turnRight':
        break;
      default:
        console.error('unknown instruction given for bot to animate');
        break;
    }
  }

  function step() {
    if (currentStep >= animation.duration) {
      // set the bot to ready
      readyForNextInstruction = true;
      
      // set new animation
      setAnimation(lightBot.bot.animations.stand);
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

  function draw() {
    var offset = {
      x: (1 - currentStep / animation.duration) * movement.dX,
      y: (1 - currentStep / animation.duration) * movement.dY,
      z: (1 - currentStep / animation.duration) * movement.dZ
    };

    // modify y offset during jump animations for a more natural movement
    if (animation.name === "jumpUp") {
      // jump up y movement is defined by f(x) = sin(x) from 0 to pi/2: http://www.wolframalpha.com/input/?i=f%28x%29+%3Dsin%28x%29+from+0+to+pi%2F2
      offset.y = Math.sin(currentStep / animation.duration * Math.PI/2) * movement.dY;

    }
    if (animation.name === "jumpDown") {
      // jump down y movement is defined by f(x) = x^3 from 0 to 1: http://www.wolframalpha.com/input/?i=f%28x%29+%3D+x%5E3+from+0+to+1
      offset.y = Math.pow(currentStep / animation.duration, 3) * movement.dY;
    }

    var p = lightBot.projection.project((this.currentPos.x) * lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength() + offset.x,
                                        lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() * lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength() + offset.y,
                                        (this.currentPos.y) * lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength() + offset.z);
    var srcX = animation.sX + currentFrame * animation.width;
    var srcY = this.direction * animation.height;
    var dX = p.x - animation.width / 2; // center image horizontally
    var dY = p.y - animation.height;

    // round dX and dY down to avoid anti-aliasing when drawing the sprite
    lightBot.ctx.drawImage(image, srcX, srcY, animation.width, animation.height, Math.floor(dX), Math.floor(dY), animation.width, animation.height);
  }

  function setAnimation(a) {
    animation = a;
    currentStep = 0;
    currentFrame = 0;
  }

  function setMovement(dX, dY, dZ) {
    movement.dX = dX;
    movement.dY = dY;
    movement.dZ = dZ;
  }

  function isReadyForNextInstruction() {
    return readyForNextInstruction;
  }

  lightBot.bot.animate = animate;
  lightBot.bot.step = step;
  lightBot.bot.draw = draw;
  lightBot.bot.setAnimation = setAnimation;
  lightBot.bot.setMovement = setMovement;
  lightBot.bot.isReadyForNextInstruction = isReadyForNextInstruction;
})();