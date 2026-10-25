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
  var colorTop = defaultTop;
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
    // Use one theme surface with consistent lighting on each orientation.
    colorTop = readThemeColor(["--color-base-200", "--b2"], defaultTop);
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
  var animationFrames = 60; // slower, restrained pulse inside a fixed inset panel
  LightBox.prototype.pulseGrowing = true; // controls the growth/shrink of the pulse animation
  LightBox.prototype.currentAnimationFrame = 0; // current animation frame, used internally to control the animation

  function fillFace(tint, opacity, edgeOpacity) {
    app.ctx.fillStyle = colorTop;
    app.ctx.fill();
    app.ctx.save();
    app.ctx.fillStyle = tint;
    app.ctx.globalAlpha = opacity;
    app.ctx.fill();
    app.ctx.globalAlpha = edgeOpacity;
    app.ctx.stroke();
    app.ctx.restore();
  }

  function topInset(tile, inset) {
    var height = tile.getHeight() * edgeLength;
    var points = [
      [tile.x * edgeLength + inset, tile.y * edgeLength + inset],
      [(tile.x + 1) * edgeLength - inset, tile.y * edgeLength + inset],
      [(tile.x + 1) * edgeLength - inset, (tile.y + 1) * edgeLength - inset],
      [tile.x * edgeLength + inset, (tile.y + 1) * edgeLength - inset],
    ];
    app.ctx.beginPath();
    points.forEach(function (point, index) {
      var p = app.projection.project(point[0], height, point[1]);
      if (index === 0) app.ctx.moveTo(p.x, p.y);
      else app.ctx.lineTo(p.x, p.y);
    });
    app.ctx.closePath();
  }

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
    fillFace("#ffffff", 0.07, 0.48);
  }

  function drawTopFaceLightBox() {
    // Keep the tile's rim visible so the light reads as part of its surface.
    drawTopFaceBox.call(this);
    app.ctx.save();
    topInset(this, 3);
    app.ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    app.ctx.fill();
    topInset(this, 5);
    app.ctx.fillStyle = this.lightOn ? colorTopLightOn : colorTopLightOff;
    if (this.lightOn) {
      app.ctx.shadowColor = "rgba(255, 229, 69, 0.4)";
      app.ctx.shadowBlur = 6;
    }
    app.ctx.fill();
    app.ctx.shadowBlur = 0;

    var phase = this.currentAnimationFrame / animationFrames;
    var pulse = (1 - Math.cos(phase * Math.PI)) / 2;
    topInset(this, 11 - pulse * 3);
    app.ctx.fillStyle = this.lightOn ? colorTopLightOnOverlay : colorTopLightOffOverlay;
    app.ctx.fill();
    app.ctx.restore();
  }

  function drawFrontFaceBox() {
    // front face: p1 is bottom left and rest is counter-clockwise;
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
    fillFace("#000000", 0.24, 0.38);
  }

  function drawSideFaceBox() {
    // left side face: p1 is bottom front and rest is counter-clockwise;
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
    fillFace("#000000", 0.10, 0.38);
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
