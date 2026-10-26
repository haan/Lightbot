// Thin wrapper around native `<dialog>` for open/close + close-event wiring.
function getDialog(id) {
  var el = document.getElementById(id);
  if (!el) return null;
  if (typeof el.showModal !== "function") return null;
  return el;
}

function openDialog(id) {
  var dialog = getDialog(id);
  if (!dialog || dialog.open) return;
  var screen = document.querySelector(".lb-screen:not(.hidden)");
  if (!screen) return;

  // showModal enters the top layer, so its fixed bounds must follow the screen.
  function syncBounds() {
    var rect = screen.getBoundingClientRect();
    dialog.style.left = rect.left + "px";
    dialog.style.top = rect.top + "px";
    dialog.style.width = rect.width + "px";
    dialog.style.height = rect.height + "px";
  }
  syncBounds();
  dialog.showModal();
  // Focusing the dialog can scroll the page when the fixed game is larger than it.
  syncBounds();
  window.addEventListener("resize", syncBounds);
  window.addEventListener("scroll", syncBounds, true);
  var observer = new ResizeObserver(syncBounds);
  observer.observe(screen);
  dialog.addEventListener("close", function () {
    window.removeEventListener("resize", syncBounds);
    window.removeEventListener("scroll", syncBounds, true);
    observer.disconnect();
  }, { once: true });
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

