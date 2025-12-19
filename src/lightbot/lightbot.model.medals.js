// Medals: compute medal quality based on instruction count, persist best medal per level in localStorage.

export function createMedals(params) {
  if (!params) throw new Error("createMedals: missing params");
  var bot = params.bot;
  var map = params.map;
  var storage = params.storage || localStorage;
  if (!bot) throw new Error("createMedals: missing bot");
  if (!map) throw new Error("createMedals: missing map");

  var medals = {
    gold: 4,
    silver: 3,
    bronze: 2,
    noMedal: 1,
    awardMedal: function() {
      var nbrInstructions = bot.getNumberOfInstructions();
      var lvlMedals = map.getMedals();
      var medal = this.noMedal;
      if (nbrInstructions <= lvlMedals.gold) {
        medal = this.gold;
      } else if (nbrInstructions <= lvlMedals.silver) {
        medal = this.silver;
      } else if (nbrInstructions <= lvlMedals.bronze) {
        medal = this.bronze;
      }
      // only store the result if it's an improvement.
      if (!storage.getItem('lightbot_level_' + map.getLevelNumber()) || parseInt(storage.getItem('lightbot_level_' + map.getLevelNumber()), 10) < medal) {
        storage.setItem('lightbot_level_' + map.getLevelNumber(), medal);
      }
      return medal;
    }
  };

  return medals;
}
