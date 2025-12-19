// Achievement dialog queue: shows unlocked achievements one by one.
import i18next from "i18next";
export function extendAchievementsView(params) {
  if (!params) throw new Error("extendAchievementsView: missing params");
  var achievements = params.achievements;
  var dialogs = params.dialogs;
  if (!achievements) throw new Error("extendAchievementsView: missing achievements");
  if (!dialogs) throw new Error("extendAchievementsView: missing dialogs");

  var queue = null;

  function display(achievements) {
    // queue new achievements so the dialog can show them one at a time.
    if (achievements) {
      queue = achievements;
    }

    if (queue.length > 0) {
      var achievement = queue.shift();
      var messageEl = document.querySelector("#achievementDialog .message");
      if (messageEl) {
        var messageKey = achievement.i18nKey ? achievement.i18nKey + ".message" : "";
        messageEl.textContent = messageKey ? i18next.t(messageKey) : achievement.message || "";
      }
      dialogs.open('achievementDialog');
    } else {
      queue = null;
    }
  }

  achievements.display = display;
  return achievements;
}
