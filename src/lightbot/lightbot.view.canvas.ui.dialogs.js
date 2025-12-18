/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

function getDialog(id) {
  var el = document.getElementById(id);
  if (!el) return null;
  if (typeof el.showModal !== "function") return null;
  return el;
}

function openDialog(id) {
  var dialog = getDialog(id);
  if (!dialog) return;
  if (!dialog.open) dialog.showModal();
}

function closeDialog(id) {
  var dialog = getDialog(id);
  if (!dialog) return;
  if (dialog.open) dialog.close();
}

export function initDialogs() {
  var levelComplete = getDialog("levelCompleteDialog");
  if (levelComplete) {
    levelComplete.addEventListener("close", function () {
      lightBot.ui.showLevelSelectScreen();
    });
  }

  var achievementDialog = getDialog("achievementDialog");
  if (achievementDialog) {
    achievementDialog.addEventListener("close", function () {
      lightBot.achievements.display();
    });
  }
}

lightBot.ui.dialogs = {
  open: openDialog,
  close: closeDialog,
};

