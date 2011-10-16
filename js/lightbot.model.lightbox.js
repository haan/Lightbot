/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  function LightBox(height, x, y) {
    this.lightOn = false;
    this.height = height;
    this.x = x;
    this.y = y;
    this.toggleLight = function() {
      this.lightOn = !this.lightOn;
    };
  }


  LightBox.prototype = new lightBot.Box();
  LightBox.prototype.constructor = LightBox;
  lightBot.LightBox = LightBox;
})();