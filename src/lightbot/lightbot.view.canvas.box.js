/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  // dimension
  var edgeLength = 50;
  var heightScale = 0.5;

  // visual values
  var colorTop = "#c9d3d9"; //#ffa605"; // color of top face
  var colorFront = "#adb8bd"; // "#e28b00"; // color of front face
  var colorSide = "#e5f0f5"; // "#ffc133"; // color of side face
  var strokeColor = "#485256"; // color of the stroke
  var strokeWidth = 0.5; // width of the stroke

  // visual values (lightBox)
  var colorTopLightOn = "#FFE545"; // "#e3e500";
  var colorTopLightOnOverlay = "#FEFBAF"; // "#ffff7c";
  var colorTopLightOff = "#0468fb";
  var colorTopLightOffOverlay = "#4c81ff";

  // pulse values (pulse is the lighter color in the middle of the top face)
  var pulseSize = 0.5; // this represents the minimum percentage of surface that will be covered (0=disappears completely,1=always entire face), same for all lightboxes
  var animationFrames = 30; // # of frames for the pulse to fully grow/shrink, same for all lightboxes
  lightBot.LightBox.prototype.pulseGrowing = true; // controls the growth/shrink of the pulse animation
  lightBot.LightBox.prototype.currentAnimationFrame = 0; // current animation frame, used internally to control the animation

  function drawTopFaceBox() {
    // top face: p1 is front left and rest is counter-clockwise
    lightBot.ctx.fillStyle = colorTop;
    var p1 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p2 = lightBot.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p3 = lightBot.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    var p4 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    lightBot.ctx.beginPath();
    lightBot.ctx.moveTo(p1.x, p1.y);
    lightBot.ctx.lineTo(p2.x, p2.y);
    lightBot.ctx.lineTo(p3.x, p3.y);
    lightBot.ctx.lineTo(p4.x, p4.y);
    lightBot.ctx.lineTo(p1.x, p1.y);
    lightBot.ctx.fill();
    lightBot.ctx.stroke();
  }

  function drawTopFaceLightBox() {
    // top face: p1 is front left and rest is counter-clockwise
    lightBot.ctx.fillStyle = this.lightOn ? colorTopLightOn : colorTopLightOff;
    var p1 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p2 = lightBot.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p3 = lightBot.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    var p4 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    lightBot.ctx.beginPath();
    lightBot.ctx.moveTo(p1.x, p1.y);
    lightBot.ctx.lineTo(p2.x, p2.y);
    lightBot.ctx.lineTo(p3.x, p3.y);
    lightBot.ctx.lineTo(p4.x, p4.y);
    lightBot.ctx.lineTo(p1.x, p1.y);
    lightBot.ctx.fill();
    lightBot.ctx.stroke();

    // top face overlay: p1 is front left and rest is counter-clockwise
    var overlayOffset = (1-(this.currentAnimationFrame / animationFrames)) * ((1-pulseSize) * edgeLength / 2);
    lightBot.ctx.fillStyle = this.lightOn ? colorTopLightOnOverlay : colorTopLightOffOverlay;
    p1 = lightBot.projection.project(this.x * edgeLength + overlayOffset, this.getHeight() * edgeLength, this.y * edgeLength + overlayOffset);
    p2 = lightBot.projection.project((this.x+1) * edgeLength - overlayOffset, this.getHeight() * edgeLength, this.y * edgeLength + overlayOffset);
    p3 = lightBot.projection.project((this.x+1) * edgeLength - overlayOffset, this.getHeight() * edgeLength, (this.y+1) * edgeLength - overlayOffset);
    p4 = lightBot.projection.project(this.x * edgeLength + overlayOffset, this.getHeight() * edgeLength, (this.y+1) * edgeLength - overlayOffset);
    lightBot.ctx.beginPath();
    lightBot.ctx.moveTo(p1.x, p1.y);
    lightBot.ctx.lineTo(p2.x, p2.y);
    lightBot.ctx.lineTo(p3.x, p3.y);
    lightBot.ctx.lineTo(p4.x, p4.y);
    lightBot.ctx.lineTo(p1.x, p1.y);
    lightBot.ctx.fill();
  }

  function drawFrontFaceBox() {
    // front face: p1 is bottom left and rest is counter-clockwise;
    lightBot.ctx.fillStyle = colorFront;
    var p1 = lightBot.projection.project(this.x * edgeLength, 0, this.y * edgeLength);
    var p2 = lightBot.projection.project((this.x+1) * edgeLength, 0, this.y * edgeLength);
    var p3 = lightBot.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p4 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    lightBot.ctx.beginPath();
    lightBot.ctx.moveTo(p1.x, p1.y);
    lightBot.ctx.lineTo(p2.x, p2.y);
    lightBot.ctx.lineTo(p3.x, p3.y);
    lightBot.ctx.lineTo(p4.x, p4.y);
    lightBot.ctx.lineTo(p1.x, p1.y);
    lightBot.ctx.fill();
    lightBot.ctx.stroke();
  }

  function drawSideFaceBox() {
    // left side face: p1 is bottom front and rest is counter-clockwise;
    lightBot.ctx.fillStyle = colorSide;
    var p1 = lightBot.projection.project(this.x * edgeLength, 0, this.y * edgeLength);
    var p2 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p3 = lightBot.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    var p4 = lightBot.projection.project(this.x * edgeLength, 0, (this.y+1) * edgeLength);
    lightBot.ctx.beginPath();
    lightBot.ctx.moveTo(p1.x, p1.y);
    lightBot.ctx.lineTo(p2.x, p2.y);
    lightBot.ctx.lineTo(p3.x, p3.y);
    lightBot.ctx.lineTo(p4.x, p4.y);
    lightBot.ctx.lineTo(p1.x, p1.y);
    lightBot.ctx.fill();
    lightBot.ctx.stroke();
  }

  function stepBox() {}

  function stepLightBox() {
    if (this.pulseGrowing) {
      if (this.currentAnimationFrame + 1 >= animationFrames) { // stop 1 frame early to avoid overlap with stroke
        this.pulseGrowing = false;
      } else {
        this.currentAnimationFrame++;
      }
    } else {
      if (this.currentAnimationFrame <= 0) {
        this.pulseGrowing = true;
      } else {
        this.currentAnimationFrame--;
      }
    }
  }

  function draw() {
    lightBot.ctx.strokeStyle = strokeColor;
    lightBot.ctx.lineWidth = strokeWidth;
    this.drawTopFace();
    this.drawFrontFace();
    this.drawSideFace();
  }

  // add getHeight method and only use getHeight in view
  function getHeight() {
    return this.height * heightScale;
  }

  function getEdgeLength() {
    return edgeLength;
  }

  lightBot.Box.prototype.step = stepBox;
  lightBot.Box.prototype.drawTopFace = drawTopFaceBox;
  lightBot.Box.prototype.drawFrontFace = drawFrontFaceBox;
  lightBot.Box.prototype.drawSideFace = drawSideFaceBox;
  lightBot.Box.prototype.draw = draw;
  lightBot.Box.prototype.getHeight = getHeight;
  lightBot.Box.prototype.getEdgeLength = getEdgeLength;

  lightBot.LightBox.prototype.step = stepLightBox;
  lightBot.LightBox.prototype.drawTopFace = drawTopFaceLightBox;
})();