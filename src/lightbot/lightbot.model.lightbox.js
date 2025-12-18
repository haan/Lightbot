// Tile type: a box that can be lit/unlit. Extends `Box`.

export function createLightBox(params) {
  var Box = params && params.Box ? params.Box : null;
  if (!Box) throw new Error("createLightBox: missing Box");

  function LightBox(height, x, y) {
    this.lightOn = false;
    this.height = height;
    this.x = x;
    this.y = y;
    this.toggleLight = function() {
      this.lightOn = !this.lightOn;
    };
    this.reset = function() {
      this.lightOn = false;
    };
  }


  LightBox.prototype = new Box();
  LightBox.prototype.constructor = LightBox;
  return LightBox;
}
