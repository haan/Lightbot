/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var animations = {
    stand: {
      name: 'stand',
      loop: false, // set to true for animation to loop automatically
      totalFrames: 1, // # of images in the animation
      step: 10, // # of frames before animation advances - controls animation speed
      duration: 10, // # of steps the entire animation lasts. stand.duration defines the idle time after turn instructions. for non-looping animations, if the duration is larger than (totalFrames * step), the last frame is displayed until the end.
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
      loop: true,
      totalFrames: 2,
      step: 3,
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
  };

  lightBot.bot.animations = animations;
})();