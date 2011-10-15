(function() {

  // bot sprites
  var image = new Image();
  image.src = 'img/sprites.png';

  // bot animation
  var currentStep = 0; // # of frames since animation started
  var currentMovementStep = 0; // # of frames since movement started
  var currentFrame = 0; // current animation frame
  var animation = lightBot.bot.animations.stand; // current animation
  //var movement = Movement; // controls bot movement during walk or jump

  function step() {
    if (currentStep >= animation.duration) {
      animation = lightBot.bot.animations.stand;
      currentStep = 0;
      currentFrame = 0;
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
    var p = lightBot.projection.project((this.currentPos.x) * lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength(),
                                        lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getHeight() * lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength(),
                                        (this.currentPos.y) * lightBot.map.getMapRef()[this.currentPos.x][this.currentPos.y].getEdgeLength());
    var srcX = animation.sX + currentFrame * animation.width;
    var srcY = this.direction * animation.height;
    var dX = p.x - animation.width / 2; // center image horizontally
    var dY = p.y - animation.height;

    // round dX and dY down to avoid anti-aliasing when drawing the sprite
    lightBot.ctx.drawImage(image, srcX, srcY, animation.width, animation.height, Math.floor(dX), Math.floor(dY), animation.width, animation.height);
  }

  lightBot.bot.step = step;
  lightBot.bot.draw = draw;
})();