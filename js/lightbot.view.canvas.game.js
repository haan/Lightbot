var canvasView = function(canvas) {
  // set the rendering context
  lightBot.ctx = canvas.get(0).getContext('2d');
  
  // refresh rate and rendering loop
  var fps = 30;
  var fpsDelay = 1000 / fps;
  var fpsTimer = setInterval(update, fpsDelay);

  // distance between lowest point in the map and the bottom edge
  var offsetY = 50;

  // create projection
  lightBot.projection = new lightBot.Projection(canvas.get(0).height, canvas.get(0).width / 2, offsetY);

  // create canvas background pattern
  var bg = null;

  var tmp = new Image();
  tmp.src = 'img/pattern.png';
  tmp.onload = function() {
    bg = lightBot.ctx.createPattern(tmp, 'repeat');
  };

  function update() {
    // check if we can execute the next bot instruction here?
    if (lightBot.bot.isReadyForNextInstruction()) {
      var oldPos = jQuery.extend({}, lightBot.bot.currentPos); // copy old position
      var instruction = lightBot.bot.executeNextInstruction(); // execute the next instruction
      var newPos = lightBot.bot.currentPos; // get the new position
      lightBot.bot.animate(instruction, oldPos, newPos);
    }
    // check if map has been completed here
    lightBot.step();
    lightBot.draw();
  }

  function step() {
    lightBot.bot.step();
    lightBot.map.step();
  }

  function draw() {
    //clear main canvas
    lightBot.ctx.clearRect(0,0, canvas.width(), canvas.height());

    // background
    lightBot.ctx.fillStyle = bg;
    lightBot.ctx.fillRect(0,0, canvas.width(), canvas.height());

    // draw the map which takes care of drawing the robot
    lightBot.map.draw();
  }

  lightBot.step = step;
  lightBot.draw = draw;

  return {};
};