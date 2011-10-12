function LightBot(drawCanvas) {

  var Animations = {
    stand: {
      name: 'stand',
      loop: false, // set to true for animation to loop automatically
      totalFrames: 1, // # of images in the animation
      step: 20, // # of frames before animation advances - controls animation speed
      duration: 20, // # of frames the entire animation lasts - only useful for looping animations
      width: 80,
      height: 100, // should be same for every animation
      sX: 0  // X offset for where animation is located in source file
    },
    walk: {
      name: 'walk',
      loop: true,
      totalFrames: 3,
      step: 5,
      duration: 20,
      width: 80,
      height: 100,
      sX: 80
    },
    light: {
      name: 'light',
      loop: false,
      totalFrames: 2,
      step: 10,
      duration: 20,
      width: 80,
      height: 100,
      sX: 480
    },
    jumpUp: {
      name: 'jumpUp',
      loop: false,
      totalFrames: 1,
      step: 15,
      duration: 15,
      width: 80,
      height: 100,
      sX: 320
    },
    jumpDown: {
      name: 'jumpDown',
      loop: false,
      totalFrames: 1,
      step: 15,
      duration: 15,
      width: 80,
      height: 100,
      sX: 400
    }
  }

  var Movement = {
    enabled: false, // if the movement is currently taking place
    dX: 0, // X-axis displacement
    dY: 0, // Y-axis displacement
    dZ: 0 // Z-axis displacement
  }

  var IsometricProjection = {
    project: function(x,y,z) {
      /*
        Math: http://en.wikipedia.org/wiki/Isometric_projection#Overview
        More Theory: http://www.compuphase.com/axometr.htm
        Angles used: vertical rotation=45°, horizontal rotation=arctan(0,5)
        projection matrix:
        | 0,707  0     -0,707 |
        | 0,321  0,891  0,321 |
        | 0,630 -0,453  0,630 |

        Additional offset!
        Y Axis is inverted.
       */
      return {'x': IsometricProjection.offsetX + 0.707*x - 0.707*z, 'y': IsometricProjection.clientHeight - (IsometricProjection.offsetY + 0.321*x + 0.891*y + 0.321*z)};
    }
  }

  /*
    Abstract class for drawable game elements
   */
  function DrawableElement() {
    this.type = null;

    this.init = function() {
      return null;
    }

    this.draw = function() {
      return null;
    }

    this.step = function(){
      return null;
    }

    this.move = function() {
      return null;
    }

    this.getType = function() {
      return this.type;
    }
  }

  /*
    A generic map element
    height defines the height of the element and is a weighted multiple of the edge length. values are 1, 2, ...
    x and y define the position of the map element in 2d coordinate space. (0, 0) is lower left corner
   */
  function Box(height, x, y) {
    this.type = "box";

    // dimension and position
    this.edgeLength = 50; // base is always a square so we only define length of one edge
    this.heightScale = 0.5; // the box height is weighted by this factor to make it look better
    this.height = height * this.heightScale;
    this.x = x; // the column number of the box within the 2D grid of the map
    this.y = y; // the row number of the box within the 2D grid of the map

    // visual values
    var colorTop = "#c9d3d9"; //#ffa605"; // color of top facet
    var colorFront = "#adb8bd"; // "#e28b00"; // color of front facet
    var colorSide = "#e5f0f5"; // "#ffc133"; // color of side facet
    var strokeColor = "#485256"; // color of the stroke
    var strokeWidth = 0.5; // width of the stroke

    this.getEdgeLength = function() {
      return this.edgeLength;
    }

    this.getHeight = function() {
      return this.height;
    }

    this.getHeightScale = function() {
      return this.heightScale;
    }

    this.drawFrontFace = function() {
      // front face: p1 is bottom left and rest is counter-clockwise;
      if (this.y == 0 || map.getHeight(this.x, this.y-1) < this.height) {
        ctx.fillStyle = colorFront;
        var p1 = IsometricProjection.project(this.x * this.edgeLength, 0, this.y * this.edgeLength);
        var p2 = IsometricProjection.project((this.x+1) * this.edgeLength, 0, this.y * this.edgeLength);
        var p3 = IsometricProjection.project((this.x+1) * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
        var p4 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.fill();
        ctx.stroke();
      }
    }

    this.drawSideFace = function() {
      // left side face: p1 is bottom front and rest is counter-clockwise;
      if (this.x == 0 || map.getHeight(this.x-1, this.y) < this.height) {
        ctx.fillStyle = colorSide;
        var p1 = IsometricProjection.project(this.x * this.edgeLength, 0, this.y * this.edgeLength);
        var p2 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
        var p3 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, (this.y+1) * this.edgeLength);
        var p4 = IsometricProjection.project(this.x * this.edgeLength, 0, (this.y+1) * this.edgeLength);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.fill();
        ctx.stroke();
      }
    }

    this.drawTopFace = function() {
      // top face: p1 is front left and rest is counter-clockwise
      if (this.x == 0 || this.y == 0 || (map.getHeight(this.x-1, this.y-1) - this.height) < 2*this.heightScale) { // difference of 1 is not enough to cover the block entirely
        ctx.fillStyle = colorTop;
        p1 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
        p2 = IsometricProjection.project((this.x+1) * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
        p3 = IsometricProjection.project((this.x+1) * this.edgeLength, this.height * this.edgeLength, (this.y+1) * this.edgeLength);
        p4 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, (this.y+1) * this.edgeLength);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.fill();
        ctx.stroke();
      }
    }

    this.draw = function() {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      this.drawFrontFace();
      this.drawSideFace();
      this.drawTopFace();
    }
  }
  // Box extends DrawableElement
  Box.prototype = new DrawableElement();
  Box.prototype.constructor = Box;

  /*
    A light map element which extends the generic Box element
   */
  function LightBox(height, x, y) {
    this.type = "lightbox";

    // lightbox specified values
    var lightOn = false;

    // dimension and position
    this.height = height * this.heightScale;
    this.x = x;
    this.y = y;

    // visual values
    var colorTopLightOn = "#FFE545"; // "#e3e500";
    var colorTopLightOnOverlay = "#FEFBAF"; // "#ffff7c";
    var colorTopLightOff = "#0468fb";
    var colorTopLightOffOverlay = "#4c81ff";

    // pulse values (pulse is the lighter color in the middle of the top facet)
    var pulseGrowing = true; // controls the growth/shrink of the pulse animation
    var pulseSize = 0.5; // this represents the minimum percentage of surface that will be covered (0=disappears completely,1=always entire facet)
    var currentAnimationFrame = 0; // current animation frame, used internally to control the animation
    var animationFrames = 30; // # of frames for the pulse to fully grow/shrink

    this.isLightOn = function() {
      return lightOn;
    }

    this.toggleLight = function() {
      lightOn = !lightOn;
    }

    this.lightOff = function() {
      lightOn = false;
    }

    // overwrite default Box method
    this.drawTopFace = function() {
      // top face: p1 is front left and rest is counter-clockwise
      ctx.fillStyle = lightOn ? colorTopLightOn : colorTopLightOff;
      p1 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
      p2 = IsometricProjection.project((this.x+1) * this.edgeLength, this.height * this.edgeLength, this.y * this.edgeLength);
      p3 = IsometricProjection.project((this.x+1) * this.edgeLength, this.height * this.edgeLength, (this.y+1) * this.edgeLength);
      p4 = IsometricProjection.project(this.x * this.edgeLength, this.height * this.edgeLength, (this.y+1) * this.edgeLength);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
      ctx.stroke();

      // top face overlay: p1 is front left and rest is counter-clockwise
      var overlayOffset = (1-(currentAnimationFrame / animationFrames)) * ((1-pulseSize) * this.getEdgeLength() / 2);
      ctx.fillStyle = lightOn ? colorTopLightOnOverlay : colorTopLightOffOverlay;
      p1 = IsometricProjection.project(this.x * this.edgeLength + overlayOffset, this.height * this.edgeLength, this.y * this.edgeLength + overlayOffset);
      p2 = IsometricProjection.project((this.x+1) * this.edgeLength - overlayOffset, this.height * this.edgeLength, this.y * this.edgeLength + overlayOffset);
      p3 = IsometricProjection.project((this.x+1) * this.edgeLength - overlayOffset, this.height * this.edgeLength, (this.y+1) * this.edgeLength - overlayOffset);
      p4 = IsometricProjection.project(this.x * this.edgeLength + overlayOffset, this.height * this.edgeLength, (this.y+1) * this.edgeLength - overlayOffset);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
    }

    this.step = function() {
      if (pulseGrowing) {
        if (currentAnimationFrame + 1 >= animationFrames) { // stop 1 frame early to avoid overlap with stroke
          pulseGrowing = false;
        } else {
          currentAnimationFrame++;
        }
      } else {
        if (currentAnimationFrame <= 0) {
          pulseGrowing = true;
        } else {
          currentAnimationFrame--;
        }
      }
    }
  }
  /* LightBox extends Box */
  LightBox.prototype = new Box();
  LightBox.prototype.constructor = LightBox;

  /*
    This is the BOT
   */
  function Bot() {
    this.type = "bot";

    var startingPos = {};
    var currentPos = {};

    // bot specified values
    var botReady = false; // bot is ready when he has a position
    var startingDirection = directions.se, direction = startingDirection;

    // bot instructions queues
    var botReadyForNextInstruction = false; // bot is ready when the previous animation/movement has completed
    var instructionQueue = [];
    var nbrInstructions = 0; // counter to determine the medal when level is completed

    // bot reset flag
    var resetFlag = false;

    // bot images
    var image = new Image();
    image.src = 'img/sprites2.png';

    // bot animation
    var currentStep = 0; // # of frames since last image change
    var currentMovementStep = 0; // # of frames since movement started
    var currentFrame = 0; // current animation frame
    var animation = Animations.stand; // current animation
    var movement = Movement; // controls bot movement during walk or jump

    this.init = function() {
      startingPos = {};
      currentPos = {};
      botReady = false;
      direction = directions.se;
      botReadyForNextInstruction = false;
      instructionQueue.length = 0;
      resetFlag = false;
      currentStep = 0;
      currentMovementStep = 0;
      currentFrame = 0;
      animation = Animations.stand;
      movement = Movement;
    }

    this.reset = function() {
      resetFlag = true;
    }

    this.clearInstructions = function() {
      instructionQueue.length = 0;
      nbrInstructions = 0;
    }

    this.queueInstruction = function(instruction) {
      instructionQueue.push(instruction);
    }

    this.resetBotToOrigin = function() {
      resetFlag = false;
      direction = startingDirection;
      animation = Animations.stand;
      currentStep = 0;
      currentMovementStep = 0;
      currentFrame = 0;
      movement = Movement;
      this.clearInstructions();
      currentPos.x = startingPos.x;
      currentPos.y = startingPos.y;
    }

    this.executeInstruction = function() {
      if (botReadyForNextInstruction) {
        if (resetFlag) {
          this.resetBotToOrigin();
        } else {
          if (instructionQueue.length > 0) {
          var instruction = instructionQueue.shift();
            switch (instruction.name) {
              case 'walk':
                this.walk();
                break;
              case 'jump':
                this.jump();
                break;
              case 'turnRight':
                this.turnRight();
                break;
              case 'turnLeft':
                this.turnLeft();
                break;
              case 'light':
                this.light();
                break;
              case 'repeat':
                if (instruction.argument > 1) {
                  instruction.argument--;
                  instructionQueue.unshift(instruction);
                }
                for (var i = instruction.body.length - 1; i >= 0 ; i--) {
                  var tmp = instruction.body[i];
                  var tmp2 = jQuery.extend(true, {}, tmp); // deep copy of object as explained here: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
                  instructionQueue.unshift(tmp2);
                }

                break;
              default:
                console.error('unknown instruction given to bot: ' + instruction.name);
            }
          }
        }
      }
    }

    this.run = function(){
      botReadyForNextInstruction = true;
    }

    this.walk = function() {
      
      botReadyForNextInstruction = false;
      movement.enabled = true;
      //movement.step = 20; // defines how long the animation lasts
      animation = Animations.walk;
      currentStep = 0;
      currentMovementStep = 0;
      currentFrame = 0;

      var d = map.getEdgeLength(currentPos.x, currentPos.y);
      switch (direction) {
        case directions.se:
          if (currentPos.y > 0 && map.getHeight(currentPos.x, currentPos.y) == map.getHeight(currentPos.x, currentPos.y-1)) {
            movement.dZ = -d;
          }
          break;
        case directions.ne:
          if (currentPos.x+1 < map.getLevelSize('x') && map.getHeight(currentPos.x, currentPos.y) == map.getHeight(currentPos.x+1, currentPos.y)) {
            movement.dX = d;
          }
          break;
        case directions.nw:
          if (currentPos.y+1 < map.getLevelSize('y') && map.getHeight(currentPos.x, currentPos.y) == map.getHeight(currentPos.x, currentPos.y+1)) {
            movement.dZ = d;
          }
          break;
        case directions.sw:
          if (currentPos.x > 0 && map.getHeight(currentPos.x, currentPos.y) == map.getHeight(currentPos.x-1, currentPos.y)) {
            movement.dX = -d;
          }
          break;
        default:
          console.error('Bot is facing unknown direction');
      }
    }

    this.jump = function() {

      botReadyForNextInstruction = false;
      movement.enabled = true;
      currentStep = 0;
      currentMovementStep = 0;
      currentFrame = 0;

      var d = map.getEdgeLength(currentPos.x, currentPos.y);

      switch (direction) {
        case directions.se:
          if (currentPos.y > 0 && (map.getHeight(currentPos.x, currentPos.y)+map.getHeightScale(currentPos.x, currentPos.y) == map.getHeight(currentPos.x, currentPos.y-1) || map.getHeight(currentPos.x, currentPos.y) > map.getHeight(currentPos.x, currentPos.y-1))) {
            movement.dZ = -d;
            movement.dY = d * (map.getHeight(currentPos.x, currentPos.y-1) - map.getHeight(currentPos.x, currentPos.y));
          }
          break;
        case directions.ne:
          if (currentPos.x+1 < map.getLevelSize('x') && (map.getHeight(currentPos.x, currentPos.y)+map.getHeightScale(currentPos.x, currentPos.y) == map.getHeight(currentPos.x+1, currentPos.y) || map.getHeight(currentPos.x, currentPos.y) > map.getHeight(currentPos.x+1, currentPos.y))) {
            movement.dX = d;
            movement.dY = d * (map.getHeight(currentPos.x+1, currentPos.y) - map.getHeight(currentPos.x, currentPos.y));
          }
          break;
        case directions.nw:
          if (currentPos.y+1 < map.getLevelSize('y') && (map.getHeight(currentPos.x, currentPos.y)+map.getHeightScale(currentPos.x, currentPos.y) == map.getHeight(currentPos.x, currentPos.y+1) || map.getHeight(currentPos.x, currentPos.y) > map.getHeight(currentPos.x, currentPos.y+1))) {
            movement.dZ = d;
            movement.dY = d * (map.getHeight(currentPos.x, currentPos.y+1) - map.getHeight(currentPos.x, currentPos.y));
          }
          break;
        case directions.sw:
          if (currentPos.x > 0 && (map.getHeight(currentPos.x, currentPos.y)+map.getHeightScale(currentPos.x, currentPos.y) == map.getHeight(currentPos.x-1, currentPos.y) || map.getHeight(currentPos.x, currentPos.y) > map.getHeight(currentPos.x-1, currentPos.y))) {
            movement.dX = -d;
            movement.dY = d * (map.getHeight(currentPos.x-1, currentPos.y) - map.getHeight(currentPos.x, currentPos.y));
          }
          break;
        default:
          console.error('Bot is facing unknown direction');
      }

      if (movement.dY >= 0) {
        animation = Animations.jumpUp;
      } else {
        animation = Animations.jumpDown;
      }
    }

    this.turnLeft = function() {
      direction = (direction+1) % 4;
    }

    this.turnRight = function() {
      direction--;
      if (direction < 0) {
        direction = 3;
      }
    }

    this.light = function() {
      botReadyForNextInstruction = false;
      animation = Animations.light;
      currentStep = 0;
      currentMovementStep = 0;
      currentFrame = 0;
      
      map.toggleLight(currentPos.x, currentPos.y);
    }

    // draw the bot
    this.draw = function() {
      if (botReady) {

        var offset = {'x': 0, 'y': 0, 'z': 0};
        if (movement.enabled) {
          offset.x = currentMovementStep / animation.duration * movement.dX;
          offset.y = currentMovementStep / animation.duration * movement.dY;
          offset.z = currentMovementStep / animation.duration * movement.dZ;

          // modify y offset during jump animations for a more natural movement
          if (animation.name === "jumpUp") {
            // jump up y movement is defined by f(x) = sin(x) from 0 to pi/2: http://www.wolframalpha.com/input/?i=f%28x%29+%3Dsin%28x%29+from+0+to+pi%2F2
            offset.y = Math.sin(currentMovementStep / animation.duration * Math.PI/2) * movement.dY;

          }
          if (animation.name === "jumpDown") {
            // jump down y movement is defined by f(x) = x^3 from 0 to 1: http://www.wolframalpha.com/input/?i=f%28x%29+%3D+x%5E3+from+0+to+1
            offset.y = Math.pow(currentMovementStep / animation.duration, 3) * movement.dY;
          }
        }

        var p = IsometricProjection.project((currentPos.x) * map.getEdgeLength(currentPos.x, currentPos.y) + offset.x,
                                            map.getHeight(currentPos.x, currentPos.y) * map.getEdgeLength(currentPos.x, currentPos.y) + offset.y,
                                            (currentPos.y) * map.getEdgeLength(currentPos.x, currentPos.y) + offset.z);

        var srcX = animation.sX + currentFrame * animation.width;
        var srcY = direction * animation.height;
        var dX = p.x - animation.width / 2; // center image horizontally
        var dY = p.y - animation.height;

        // round dX and dY down to avoid anti-aliasing when drawing the sprite
        ctx.drawImage(image, srcX, srcY, animation.width, animation.height, Math.floor(dX), Math.floor(dY), animation.width, animation.height);
      }
    }

    // controls animations
    this.step = function() {
      if (currentStep >= animation.step) {
        currentStep = 0;
        currentFrame++;
        if (currentFrame >= animation.totalFrames) {
          if (animation.loop) {
            if (animation.name == 'walk') {
              currentFrame = 1; // special case for "walk" animations since frames should be displayed 0,1,2,1,2,1,2 ...
            } else {
              currentFrame = 0;
            }
          } else {
            // animation has completed and bot can accept next instruction
            botReadyForNextInstruction = true;
            if (animation.name == 'light') {
              animation = Animations.stand;
            }

            currentFrame = animation.totalFrames - 1;
          }
        }
      } else {
        currentStep++;
      }
    }

    // controls movement
    this.move = function() {
      if (movement.enabled) {
        if (currentMovementStep >= animation.duration) {
          switch (direction) {
            case directions.se:
              if (movement.dZ != 0) {
                currentPos.y--;
              }
              break;
            case directions.ne:
              if (movement.dX != 0) {
                currentPos.x++;
              }
              break;
            case directions.nw:
              if (movement.dZ != 0) {
                currentPos.y++;
              }
              break;
            case directions.sw:
              if (movement.dX != 0) {
                currentPos.x--;
              }
              break;
            default:
              console.error('Bot is facing unknown direction');
          }

          // movement has completed and bot can accept next instruction
          botReadyForNextInstruction = true;
          animation = Animations.stand;
          currentStep = 0;
          currentMovementStep = 0;
          currentFrame = 0;
          movement.enabled = false;
          movement.dX = 0;
          movement.dY = 0;
          movement.dZ = 0;
        } else {
          currentMovementStep++;
        }
      }
    }

    this.setStartingDirection = function(d) {
      startingDirection = d;
      this.setDirection(d);
    }

    this.setDirection = function(d) {
      direction = d;
    }

    this.getDirection = function() {
      return direction;
    }

    this.getPosition = function(n) {
      return currentPos[n];
    }

    this.setPosition = function(x, y) {
      startingPos.x = x;
      startingPos.y = y;

      currentPos.x = x;
      currentPos.y = y;

      botReady = true;
    }

    this.isReady = function() {
      return botReady;
    }

    this.isReadyForNextInstruction = function() {
      return botReadyForNextInstruction;
    }

    this.isMoving = function() {
      return movement.enabled;
    }
    
    this.getAnimationName = function() {
      return animation.name;
    }

    this.getMovement = function() {
      return movement;
    }

    this.setNumberOfInstructions = function(n) {
      nbrInstructions = n;
    }

    this.getNumberOfInstructions = function(n) {
      return nbrInstructions;
    }
  }
  // Bot extends DrawableElement
  Bot.prototype = new DrawableElement();
  Bot.prototype.constructor = Bot;

  /*
    The level map
   */
  function Map() {

    // map specific values
    var level = 0;
    var mapReady = false; // map is ready for drawing when map has loaded
    var levelSize = {}; // the level size
    var mapRef = null; // the actual map values
    var medals = null; // number of instructions to get a medal

    // map files
    var mapFileExtension = '.txt';

    this.init = function() {
      mapReady= false;
      levelSize = {};
      mapRef = null;
    }

    this.resetMap = function() {
      for (var i = 0; i < levelSize.x; i++) {
        for (var j = 0; j < levelSize.y; j++) {
          if (mapRef[i][j].getType() == 'lightbox') {
            mapRef[i][j].lightOff();
          }
        }
      }
    }

    this.loadMap = function(mapNumber) {
      level = mapNumber;
      mapReady = false;
      $.getJSON('maps/map' + mapNumber + mapFileExtension, function (data) {

        // set the bot starting direction
        bot.setStartingDirection(data.direction);

        // set the medals values
        medals = data.medals;

        // map files are defined user-friendly so we have to adapt to that
        levelSize.x = data.map[0].length; // we suppose map is a rectangle
        levelSize.y = data.map.length;

        mapRef = new Array(levelSize.x);
        for (var i = 0; i < levelSize.x; i++) {
          mapRef[i] = new Array(levelSize.y);
        }

        var botInMap = false;
        var nbrLights = 0;

        for (var i = 0; i < data.map.length; i++){
          for (var j = 0; j < data.map[i].length; j++) {
            switch (data.map[i][j].t) {
              case 'x':
                if (botInMap) {
                  console.error('Two bots in map file.')
                };
                bot.setPosition(j, data.map.length - i - 1);
                botInMap = true;
              case 'b':
                mapRef[j][data.map.length - i - 1] = new Box(data.map[i][j].h, j, data.map.length - i - 1);
                break;
              case 'l':
                mapRef[j][data.map.length - i - 1] = new LightBox(data.map[i][j].h, j, data.map.length - i - 1);
                nbrLights++;
                break;
              default:
                console.error('Map contains unsupported DrawableElement: ' + data.map[i][j].t);
                // fall back to box element
                mapRef[j][data.map.length - i - 1] = new Box(data.map[i][j].h, j, data.map.length - i - 1);
            }
          }
        }

        if (!botInMap) {
          console.error('No bot defined in map');
        } else {
          mapReady = true;
        }

        if (nbrLights == 0) {
          console.error('No light defined in map');
        }
      });
    }

    this.getLevel = function() {
      return level;
    }

    this.getEdgeLength = function(x, y) {
      return mapRef[x][y].getEdgeLength();
    }

    this.getHeight = function(x, y) {
      return mapRef[x][y].getHeight();
    }

    this.getHeightScale = function(x, y) {
      return mapRef[x][y].getHeightScale();
    }

    this.getLevelSize = function(dir) {
      return levelSize[dir];
    }

    this.getMedals = function() {
      return medals;
    }

    this.toggleLight = function(x, y) {
      if (mapRef[x][y].getType() == 'lightbox') {
        mapRef[x][y].toggleLight();
      }
    }

    this.isCompleted = function() {
      if (!mapReady) {
        return false;
      }

      for (var i = 0; i < levelSize.x; i++) {
        for (var j = 0; j < levelSize.y; j++) {
          if (mapRef[i][j].getType() == 'lightbox' && !mapRef[i][j].isLightOn()) {
            return false;
          }
        }
      }

      return true;
    }

    this.step = function() {
      if (mapReady) {
        for (var i = 0; i < levelSize.x; i++) {
          for (var j = 0; j < levelSize.y; j++) {
            mapRef[i][j].step();
          }
        }
      }
    }

    this.draw = function() {
      if (mapReady) {
        // order is important for occlusion
        for (var i = levelSize.x - 1; i >= 0; i--) {
          for (var j = levelSize.y - 1; j >= 0; j--) {
            // draw the tile
            mapRef[i][j].draw();

            // draw the bot at the correct moment (depends on its movement)
            if (bot.isReady()) {
              if (bot.isMoving()) {
                var movement = bot.getMovement();
                switch (bot.getAnimationName()) {
                  case 'walk':
                    switch (bot.getDirection()) {
                      case directions.se:
                        if ((movement.dZ < 0 && i == bot.getPosition('x') && j+1 == bot.getPosition('y')) || (i == bot.getPosition('x') && j == bot.getPosition('y'))) {
                          bot.draw();
                        }
                        break;
                      case directions.ne:
                      case directions.nw:
                        if (i == bot.getPosition('x') && j == bot.getPosition('y')) {
                          bot.draw();
                        }
                        break;
                      case directions.sw:
                        if ((movement.dX < 0 && i+1 == bot.getPosition('x') && j == bot.getPosition('y')) || (i == bot.getPosition('x') && j == bot.getPosition('y'))) {
                          bot.draw();
                        }
                        break;
                      default:
                        console.error('Bot is facing unknown direction');
                    }
                    break;
                  case 'jumpUp':
                  case 'jumpDown':
                    switch (bot.getDirection()) {
                      case directions.se:
                        if ((movement.dY < 0 && i == bot.getPosition('x') && j+1 == bot.getPosition('y')) || (movement.dY >= 0 && i == bot.getPosition('x') && j == bot.getPosition('y'))) {
                          bot.draw();
                        }
                        break;
                      case directions.ne:
                        if ((movement.dY < 0 && i-1 == bot.getPosition('x') && j == bot.getPosition('y')) || (movement.dY >= 0 && i == bot.getPosition('x') && j == bot.getPosition('y'))) {
                          bot.draw();
                        }
                        break;
                      case directions.nw:
                        if ((movement.dY < 0 && i == bot.getPosition('x') && j-1 == bot.getPosition('y')) || (movement.dY >= 0 && i == bot.getPosition('x') && j == bot.getPosition('y'))) {
                          bot.draw();
                        }
                        break;
                      case directions.sw:
                        if ((movement.dY < 0 && i+1 == bot.getPosition('x') && j == bot.getPosition('y')) || (movement.dY >= 0 && i == bot.getPosition('x') && j == bot.getPosition('y'))) {
                          bot.draw();
                        }
                        break;
                      default:
                        console.error('Bot is facing unknown direction');
                    }
                    break;
                  default:
                    console.log('unknown animation while moving');
                }
              } else {
                if (i == bot.getPosition('x') && j == bot.getPosition('y')) {
                  bot.draw();
                }
              }
            }
          }
        }
      }
    }
  }
  Map.prototype = new DrawableElement();
  Map.prototype.constructor = Map;


  // canvas
  var canvas = drawCanvas;
  var ctx = canvas.get(0).getContext('2d');

  // game directions
  var directions = {"se": 0, "ne": 1, "nw": 2, "sw": 3};

  // isometric projection
  IsometricProjection.offsetX = canvas.get(0).width / 2; // jquery width() returns 0 since canvas is hidden
  IsometricProjection.offsetY = 50;
  IsometricProjection.clientHeight = canvas.get(0).height;

  // refresh rate and rendering loop
  var fps = 30;
  var fpsDelay = 1000 / fps;
  var fpsTimer = null;

  // game elements
  var bg = null;
  var map = null;
  var bot = null;
  var nbrOfLevels = 15;


  this.init = function() {

    // create background
    var tmp = new Image();
    tmp.src = 'img/pattern.png'
    tmp.onload = function() {
      bg = ctx.createPattern(tmp, 'repeat');
    }

    // create bot
    bot = new Bot();

    // create map
    map = new Map();
  }

  this.reset = function() {
    map.init();
    bot.init();
    if (!fpsTimer) {
      fpsTimer = setInterval($.proxy(this.draw, this), fpsDelay);
    }
  }

  this.resetMap = function() {
    map.resetMap();
    bot.reset();
  }

  this.loadMap = function (x) {
    map.loadMap(x);
  }

  this.showAchievementsDialog = function() {

    var achievements = getAchievementList();
    for (var i = 0; i < achievements.length; i++) {
      if (!hasAchievement(achievements[i]) && hasAchieved(achievements[i])) {
        $("#achievementDialog .message").html(getAchievementMessage(achievements[i]));
        setAchievement(achievements[i]);
        $("#achievementDialog").dialog("open");
        break; // we can only display one achievement dialog at a time so we have to stop after the first completed achievement
      }
    }
  }

  this.showLevelCompleteDialog = function() {
    // prepare the level completed dialog
    $('#levelCompleteDialog .medal').removeClass('medal-gold medal-silver medal-bronze');

    // add the correct icon to the level completed dialog and award medals
    if (bot.getNumberOfInstructions() <= map.getMedals().gold) {
      $('#levelCompleteDialog .medal').addClass('medal-gold');
      $('#levelCompleteDialog .message').html('');
      $.cookie('lightbot_level_' + map.getLevel(), '4', { expires: 365 });
    } else if (bot.getNumberOfInstructions() <= map.getMedals().silver) {
      $('#levelCompleteDialog .medal').addClass('medal-silver');
      $('#levelCompleteDialog .message').html('Complete the level with ' + map.getMedals().gold + ' instructions or less to receive a gold medal.');
      if (!$.cookie('lightbot_level_' + map.getLevel()) || parseInt($.cookie('lightbot_level_' + map.getLevel())) < 3) {
        $.cookie('lightbot_level_' + map.getLevel(), '3', { expires: 365 });
      }
    } else if (bot.getNumberOfInstructions() <= map.getMedals().bronze) {
      $('#levelCompleteDialog .medal').addClass('medal-bronze');
      $('#levelCompleteDialog .message').html('Complete the level with ' + map.getMedals().silver + ' instructions or less to receive a silver medal.');
      if (!$.cookie('lightbot_level_' + map.getLevel()) || parseInt($.cookie('lightbot_level_' + map.getLevel())) < 2) {
        $.cookie('lightbot_level_' + map.getLevel(), '2', { expires: 365 });
      }
    } else {
      $('#levelCompleteDialog .message').html('Complete the level with ' + map.getMedals().bronze + ' instructions or less to receive a bronze medal.');
      if (!$.cookie('lightbot_level_' + map.getLevel())) {
        $.cookie('lightbot_level_' + map.getLevel(), '1', { expires: 365 });
      }
    }
    $("#levelCompleteDialog .nbrOfInstructions").html(bot.getNumberOfInstructions());
    $("#levelCompleteDialog").dialog("open");
  }

  this.levelComplete = function() {
    clearInterval(fpsTimer);
    fpsTimer = null;

    this.showLevelCompleteDialog();
    this.showAchievementsDialog();
  }

  this.draw = function() {
    // check if the map has been completed
    if (map.isCompleted()) {
      this.levelComplete();
    }

    // update the map
    map.step();

    // update the bot
    bot.executeInstruction();
    bot.step();
    bot.move();

    //clear main canvas
    ctx.clearRect(0,0, canvas.width(), canvas.height());

    // background
    ctx.fillStyle = bg;
    ctx.fillRect(0,0, canvas.width(), canvas.height());

    // draw the map and bot
    map.draw();
  }

  this.getBot = function() {
    return bot;
  }

  this.getMap = function() {
    return map;
  }

  this.getNbrOfLevels = function() {
    return nbrOfLevels;
  }
}