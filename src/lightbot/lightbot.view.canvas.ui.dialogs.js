// Thin wrapper around native `<dialog>` for open/close + close-event wiring.
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

export function createDialogs() {
  return {
    open: openDialog,
    close: closeDialog,
  };
}

export function initDialogs(params) {
  if (!params) return;
  var ui = params.ui;
  var achievements = params.achievements;
  if (!ui || !achievements) return;

  var levelComplete = getDialog("levelCompleteDialog");
  if (levelComplete) {
    levelComplete.addEventListener("close", function () {
      ui.showLevelSelectScreen();
    });
  }

  var achievementDialog = getDialog("achievementDialog");
  if (achievementDialog) {
    achievementDialog.addEventListener("close", function () {
      achievements.display();
    });
  }
}

