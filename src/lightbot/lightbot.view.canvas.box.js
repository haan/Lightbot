// Tile/box drawing "view" extension: adds `draw()`/`step()` behavior to Box + LightBox.
export function extendBoxView(params) {
  if (!params) throw new Error("extendBoxView: missing params");
  var app = params.app;
  var Box = params.Box;
  var LightBox = params.LightBox;
  if (!app) throw new Error("extendBoxView: missing app");
  if (!Box) throw new Error("extendBoxView: missing Box");
  if (!LightBox) throw new Error("extendBoxView: missing LightBox");

  // dimension
  var edgeLength = 50;
  var heightScale = 0.5;

  // visual values
  var defaultTop = "#c9d3d9"; //#ffa605"; // color of top face
  var defaultFront = "#adb8bd"; // "#e28b00"; // color of front face
  var defaultSide = "#e5f0f5"; // "#ffc133"; // color of side face
  var colorTop = defaultTop;
  var colorFront = defaultFront;
  var colorSide = defaultSide;
  var defaultStroke = "#485256"; // color of the stroke
  var strokeColor = defaultStroke;
  var strokeWidth = 0.5; // width of the stroke

  // visual values (lightBox)
  var colorTopLightOn = "#FFE545"; // "#e3e500";
  var colorTopLightOnOverlay = "#FEFBAF"; // "#ffff7c";
  var colorTopLightOff = "#0468fb";
  var colorTopLightOffOverlay = "#4c81ff";

  function readThemeColor(names, fallback) {
    if (typeof window === "undefined" || !window.getComputedStyle) return fallback;
    var root = document.documentElement;
    if (!root) return fallback;
    var styles = window.getComputedStyle(root);
    for (var i = 0; i < names.length; i++) {
      var value = styles.getPropertyValue(names[i]);
      if (value) {
        var trimmed = value.trim();
        if (trimmed) return trimmed;
      }
    }
    return fallback;
  }

  function syncThemeColors() {
    // Use theme background colors for base boxes: top=base-200, side=base-100, front=base-300.
    colorTop = readThemeColor(["--color-base-200", "--b2"], defaultTop);
    colorSide = readThemeColor(["--color-base-300", "--b3"], defaultSide);
    colorFront = readThemeColor(["--color-base-100", "--b1"], defaultFront);
    strokeColor = readThemeColor(["--color-base-content", "--bc"], defaultStroke);
  }

  function observeThemeChanges() {
    if (typeof MutationObserver === "undefined") return;
    var root = document.documentElement;
    if (!root) return;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === "data-theme") {
          syncThemeColors();
          break;
        }
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  // pulse values (pulse is the lighter color in the middle of the top face)
  var pulseSize = 0.5; // this represents the minimum percentage of surface that will be covered (0=disappears completely,1=always entire face), same for all lightboxes
  var animationFrames = 30; // # of frames for the pulse to fully grow/shrink, same for all lightboxes
  LightBox.prototype.pulseGrowing = true; // controls the growth/shrink of the pulse animation
  LightBox.prototype.currentAnimationFrame = 0; // current animation frame, used internally to control the animation

  function drawTopFaceBox() {
    // top face: p1 is front left and rest is counter-clockwise
    app.ctx.fillStyle = colorTop;
    var p1 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p2 = app.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p3 = app.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    var p4 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    app.ctx.beginPath();
    app.ctx.moveTo(p1.x, p1.y);
    app.ctx.lineTo(p2.x, p2.y);
    app.ctx.lineTo(p3.x, p3.y);
    app.ctx.lineTo(p4.x, p4.y);
    app.ctx.lineTo(p1.x, p1.y);
    app.ctx.fill();
    app.ctx.stroke();
  }

  function drawTopFaceLightBox() {
    // top face: p1 is front left and rest is counter-clockwise
    app.ctx.fillStyle = this.lightOn ? colorTopLightOn : colorTopLightOff;
    var p1 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p2 = app.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p3 = app.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    var p4 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    app.ctx.beginPath();
    app.ctx.moveTo(p1.x, p1.y);
    app.ctx.lineTo(p2.x, p2.y);
    app.ctx.lineTo(p3.x, p3.y);
    app.ctx.lineTo(p4.x, p4.y);
    app.ctx.lineTo(p1.x, p1.y);
    app.ctx.fill();
    app.ctx.stroke();

    // top face overlay: p1 is front left and rest is counter-clockwise
    var overlayOffset = (1-(this.currentAnimationFrame / animationFrames)) * ((1-pulseSize) * edgeLength / 2);
    app.ctx.fillStyle = this.lightOn ? colorTopLightOnOverlay : colorTopLightOffOverlay;
    p1 = app.projection.project(this.x * edgeLength + overlayOffset, this.getHeight() * edgeLength, this.y * edgeLength + overlayOffset);
    p2 = app.projection.project((this.x+1) * edgeLength - overlayOffset, this.getHeight() * edgeLength, this.y * edgeLength + overlayOffset);
    p3 = app.projection.project((this.x+1) * edgeLength - overlayOffset, this.getHeight() * edgeLength, (this.y+1) * edgeLength - overlayOffset);
    p4 = app.projection.project(this.x * edgeLength + overlayOffset, this.getHeight() * edgeLength, (this.y+1) * edgeLength - overlayOffset);
    app.ctx.beginPath();
    app.ctx.moveTo(p1.x, p1.y);
    app.ctx.lineTo(p2.x, p2.y);
    app.ctx.lineTo(p3.x, p3.y);
    app.ctx.lineTo(p4.x, p4.y);
    app.ctx.lineTo(p1.x, p1.y);
    app.ctx.fill();
  }

  function drawFrontFaceBox() {
    // front face: p1 is bottom left and rest is counter-clockwise;
    app.ctx.fillStyle = colorFront;
    var p1 = app.projection.project(this.x * edgeLength, 0, this.y * edgeLength);
    var p2 = app.projection.project((this.x+1) * edgeLength, 0, this.y * edgeLength);
    var p3 = app.projection.project((this.x+1) * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p4 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    app.ctx.beginPath();
    app.ctx.moveTo(p1.x, p1.y);
    app.ctx.lineTo(p2.x, p2.y);
    app.ctx.lineTo(p3.x, p3.y);
    app.ctx.lineTo(p4.x, p4.y);
    app.ctx.lineTo(p1.x, p1.y);
    app.ctx.fill();
    app.ctx.stroke();
  }

  function drawSideFaceBox() {
    // left side face: p1 is bottom front and rest is counter-clockwise;
    app.ctx.fillStyle = colorSide;
    var p1 = app.projection.project(this.x * edgeLength, 0, this.y * edgeLength);
    var p2 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, this.y * edgeLength);
    var p3 = app.projection.project(this.x * edgeLength, this.getHeight() * edgeLength, (this.y+1) * edgeLength);
    var p4 = app.projection.project(this.x * edgeLength, 0, (this.y+1) * edgeLength);
    app.ctx.beginPath();
    app.ctx.moveTo(p1.x, p1.y);
    app.ctx.lineTo(p2.x, p2.y);
    app.ctx.lineTo(p3.x, p3.y);
    app.ctx.lineTo(p4.x, p4.y);
    app.ctx.lineTo(p1.x, p1.y);
    app.ctx.fill();
    app.ctx.stroke();
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
    app.ctx.strokeStyle = strokeColor;
    app.ctx.lineWidth = strokeWidth;
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

  Box.prototype.step = stepBox;
  Box.prototype.drawTopFace = drawTopFaceBox;
  Box.prototype.drawFrontFace = drawFrontFaceBox;
  Box.prototype.drawSideFace = drawSideFaceBox;
  Box.prototype.draw = draw;
  Box.prototype.getHeight = getHeight;
  Box.prototype.getEdgeLength = getEdgeLength;

  LightBox.prototype.step = stepLightBox;
  LightBox.prototype.drawTopFace = drawTopFaceLightBox;

  syncThemeColors();
  observeThemeChanges();

  return { Box: Box, LightBox: LightBox };
}
