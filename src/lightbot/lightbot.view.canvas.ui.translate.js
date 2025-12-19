// i18next setup and DOM translation pass for elements with `data-i18n*` attributes.
import i18next from "i18next";
import { LIGHTBOT_TRANSLATIONS_DE } from "../locales/translations.de.js";
import { LIGHTBOT_TRANSLATIONS_EN } from "../locales/translations.en.js";
import { LIGHTBOT_TRANSLATIONS_FR } from "../locales/translations.fr.js";

var LANGUAGE_STORAGE_KEY = "lightbot_language";
var FALLBACK_LANGUAGE = "en";
var TRANSLATION_RESOURCES = {
  en: {
    translation: LIGHTBOT_TRANSLATIONS_EN,
  },
  de: {
    translation: LIGHTBOT_TRANSLATIONS_DE,
  },
  fr: {
    translation: LIGHTBOT_TRANSLATIONS_FR,
  },
};

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    var key = element.getAttribute("data-i18n");
    element.textContent = i18next.t(key);
  });

  document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
    var key = element.getAttribute("data-i18n-title");
    element.setAttribute("title", i18next.t(key));
  });
}

function resolveLanguage(language) {
  if (!language) return null;
  // normalize "en-US" to "en" when we only have base language keys.
  var normalized = String(language).toLowerCase();
  if (TRANSLATION_RESOURCES[normalized]) return normalized;
  var shortCode = normalized.split("-")[0];
  if (TRANSLATION_RESOURCES[shortCode]) return shortCode;
  return null;
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function setStoredLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (e) {}
}

function updateDocumentLanguage(language) {
  document.documentElement.setAttribute("lang", language);
}

function updateLanguageSelect(language) {
  var select = document.getElementById("languageSelect");
  if (!select) return;
  select.value = language;
}

function updateRunButtonTitle() {
  var btn = document.getElementById("runButton");
  if (!btn) return;
  var isRunning = btn.classList.contains("btn-error");
  btn.setAttribute("title", i18next.t(isRunning ? "controls.stop" : "gameScreen.run"));
}

function handleLanguageChange(language) {
  var resolved = resolveLanguage(language) || FALLBACK_LANGUAGE;
  applyTranslations();
  updateDocumentLanguage(resolved);
  updateLanguageSelect(resolved);
  updateRunButtonTitle();
  setStoredLanguage(resolved);
}

function initLanguageSelect() {
  var select = document.getElementById("languageSelect");
  if (!select) return;
  select.addEventListener("change", function () {
    var resolved = resolveLanguage(select.value) || FALLBACK_LANGUAGE;
    if (resolved === i18next.language) return;
    i18next.changeLanguage(resolved).catch(function (e) {
      console.error("Failed to change language:", e);
    });
  });
}

export function initI18n() {
  var storedLanguage = resolveLanguage(getStoredLanguage()) || FALLBACK_LANGUAGE;
  i18next.on("languageChanged", handleLanguageChange);

  return i18next
    .init({
      lng: storedLanguage,
      fallbackLng: FALLBACK_LANGUAGE,
      resources: TRANSLATION_RESOURCES,
    })
    .then(function () {
      handleLanguageChange(i18next.language);
      initLanguageSelect();
    });
}
