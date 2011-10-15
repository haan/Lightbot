var canvasView = function(lightbot, canvas) {
  // refresh rate and rendering loop
  var fps = 30;
  var fpsDelay = 1000 / fps;
  var fpsTimer = setInterval(update, fpsDelay);

  // distance between lowest point in the map and the bottom edge
  var offsetY = 50;

  /*
  function update() {
    LightBot.step();
    LightBot.draw();
  }

  LightBot.step = function() {
    
  }
  */
  function update() {
    lightBot.step();
    lightBot.draw();
  }

  function step() {
    lightBot.map.step();
  }

  function draw() {
    //console.log('drawing');
    // check if the map has been completed
    //if (map.isCompleted()) {
    //  this.levelComplete();
    //}

    // update the map
    //map.step();

    // update the bot
    //bot.executeInstruction();
    //bot.step();
    //bot.move();

    //clear main canvas
    lightBot.ctx.clearRect(0,0, canvas.width(), canvas.height());

    // background
    //ctx.fillStyle = bg;
    //ctx.fillRect(0,0, canvas.width(), canvas.height());

    // draw the map and bot
    //map.draw();
    lightBot.map.draw();
  }

  lightBot.ctx = canvas.get(0).getContext('2d');
  lightBot.projection = new lightBot.Projection(canvas.get(0).height, canvas.get(0).width / 2, offsetY);
  lightBot.step = step;
  lightBot.draw = draw;

  return {};
};