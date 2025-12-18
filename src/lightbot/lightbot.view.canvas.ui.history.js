// SPA-like navigation using the HTML5 History API while keeping a hash-based URL for file://.
var _historyInitialized = false;

export function initHistory(app) {
  if (!app || !app.ui) return;
  if (_historyInitialized) return;
  _historyInitialized = true;

  function stateToHash(state) {
    if (!state || !state.page) return "#/welcome";

    switch (state.page) {
      case "welcomeScreen":
        return "#/welcome";
      case "helpScreen":
        return "#/help";
      case "achievementsScreen":
        return "#/achievements";
      case "levelSelectScreen":
        return "#/levels";
      case "gameScreen":
        return "#/level/" + encodeURIComponent(state.level);
      default:
        return "#/welcome";
    }
  }

  function hashToState(hash) {
    if (!hash) return null;
    if (hash.indexOf("#") === 0) hash = hash.slice(1);
    if (hash.indexOf("/") === 0) hash = hash.slice(1);

    var parts = hash.split("/").filter(function (p) { return p.length > 0; });
    if (!parts.length) return null;

    if (parts[0] === "welcome") return { page: "welcomeScreen" };
    if (parts[0] === "help") return { page: "helpScreen" };
    if (parts[0] === "achievements") return { page: "achievementsScreen" };
    if (parts[0] === "levels") return { page: "levelSelectScreen" };

    if (parts[0] === "level" && parts.length >= 2) {
      var level = parseInt(decodeURIComponent(parts[1]), 10);
      if (!isNaN(level)) return { page: "gameScreen", level: level };
    }

    return null;
  }

  function applyState(state) {
    if (!state || !state.page) {
      app.ui.showWelcomeScreen(true);
      return;
    }

    switch (state.page) {
      case "welcomeScreen":
        app.ui.showWelcomeScreen(true);
        break;
      case "helpScreen":
        app.ui.showHelpScreen(true);
        break;
      case "achievementsScreen":
        app.ui.showAchievementsScreen(true);
        break;
      case "levelSelectScreen":
        app.ui.showLevelSelectScreen(true);
        break;
      case "gameScreen":
        app.ui.showGameScreen(state.level, true);
        break;
      default:
        console.error("Unknown history page: " + state.page);
        app.ui.showWelcomeScreen(true);
        break;
    }
  }

  function safePushState(data) {
    if (!window.history || typeof window.history.pushState !== "function") return;

    var hash = stateToHash(data);
    try {
      window.history.pushState(data, "", hash);
    } catch (e) {
      try {
        window.location.hash = hash;
      } catch (e2) { }
    }
  }

  function safeReplaceState(data) {
    if (!window.history || typeof window.history.replaceState !== "function") return;

    var hash = stateToHash(data);
    try {
      window.history.replaceState(data, "", hash);
    } catch (e) {
      try {
        window.location.hash = hash;
      } catch (e2) { }
    }
  }

  app.ui.History = {
    pushState: function (data) {
      safePushState(data);
    }
  };

  window.addEventListener("popstate", function (event) {
    var state = (event && event.state) ? event.state : null;
    if (!state) state = hashToState(window.location.hash);
    if (!state) state = { page: "welcomeScreen" };
    applyState(state);
  });

  window.addEventListener("hashchange", function () {
    var state = hashToState(window.location.hash);
    if (!state) return;
    safeReplaceState(state);
    applyState(state);
  });

  var initialState = window.history && window.history.state ? window.history.state : null;
  if (!initialState) initialState = hashToState(window.location.hash);
  if (!initialState) initialState = { page: "welcomeScreen" };

  safeReplaceState(initialState);
  applyState(initialState);
}
