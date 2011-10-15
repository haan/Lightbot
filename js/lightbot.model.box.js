(function() {
  function Box(height, x, y) {
    this.height = height; // hide height from the outside
    this.x = x;
    this.y = y;
  }

  lightBot.Box = Box;
})();