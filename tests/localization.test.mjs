import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import i18next from 'i18next';
import { initI18n } from '../src/lightbot/lightbot.view.canvas.ui.translate.js';
import { LIGHTBOT_TRANSLATIONS_EN as en } from '../src/locales/translations.en.js';

// Each contribution can be tested independently, as well as together after merging.
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serbian = {};
for (const [language, file, name] of [
  ['sr-Latn', 'srb_lat', 'LIGHTBOT_TRANSLATIONS_SRB_LAT'],
  ['sr-Cyrl', 'srb_cir', 'LIGHTBOT_TRANSLATIONS_SRB_CIR'],
]) {
  if (html.includes(`value="${language}"`)) {
    serbian[language] = (await import(`../src/locales/translations.${file}.js`))[name];
    assert.ok(serbian[language], `Missing export: ${name}`);
  }
}
assert.ok(Object.keys(serbian).length, 'At least one Serbian script must be registered');

function flatten(value, prefix = '') {
  return Object.fromEntries(Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === 'string' ? [[path, child]] : Object.entries(flatten(child, path));
  }));
}

const placeholders = value => [...value.matchAll(/{{\s*([^}]+?)\s*}}/g)].map(match => match[1]).sort();

test('Serbian resources cover every English key and preserve interpolation variables', () => {
  const source = flatten(en);
  for (const resource of Object.values(serbian)) {
    const translated = flatten(resource);
    for (const [key, value] of Object.entries(source)) {
      const variants = Object.keys(translated).filter(candidate => candidate === key || ['one', 'few', 'other'].some(suffix => candidate === `${key}_${suffix}`));
      assert.ok(variants.length, `Missing translation: ${key}`);
      for (const variant of variants) {
        assert.ok(translated[variant].trim(), `Empty translation: ${variant}`);
        assert.deepEqual(placeholders(translated[variant]), placeholders(value), variant);
      }
    }
    for (const [key, value] of Object.entries(translated)) {
      assert.ok(source[key.replace(/_(one|few|other)$/, '')], `Unexpected key: ${key}`);
      assert.doesNotMatch(value, /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff\ufffd<>]/u, key);
    }
  }
});

test('each Serbian script selects one, few and other forms, including teen exceptions', async () => {
  const counts = [[0, 'other'], [1, 'one'], [2, 'few'], [3, 'few'], [4, 'few'], [5, 'other'], [11, 'other'], [12, 'other'], [14, 'other'], [21, 'one'], [22, 'few'], [24, 'few'], [25, 'other'], [101, 'one'], [111, 'other'], [112, 'other']];
  for (const [language, resource] of Object.entries(serbian)) {
    const instance = i18next.createInstance();
    await instance.init({ lng: language, fallbackLng: false, resources: { [language]: { translation: resource } } });
    const forms = language === 'sr-Cyrl' ? { one: 'инструкцијом', few: 'инструкције', other: 'инструкција' } : { one: 'instrukcijom', few: 'instrukcije', other: 'instrukcija' };
    for (const key of ['message', 'bronzeMedalHint', 'silverMedalHint', 'goldMedalHint']) {
      for (const [count, suffix] of counts) {
        const result = instance.t(`dialogs.levelComplete.${key}`, { count });
        assert.equal(result, resource.dialogs.levelComplete[`${key}_${suffix}`].replace('{{count}}', count));
        assert.ok(result.includes(`${count} ${forms[suffix]}`), `${language}: ${key}, count=${count}`);
        assert.doesNotMatch(result, /{{|dialogs\./);
      }
    }
  }
});

test('saved Serbian scripts, regional tags, document language and selector changes stay in sync', async () => {
  const savedDocument = globalThis.document;
  const savedStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    const cases = [['en-US', 'en'], ['invalid_tag', 'en']];
    for (const language of Object.keys(serbian)) {
      cases.push([language, language], [`${language.toUpperCase()}-RS`, language], [language === 'sr-Cyrl' ? 'srb_cir' : 'srb_lat', language]);
    }
    cases.push(['sr', serbian['sr-Cyrl'] ? 'sr-Cyrl' : 'en']);
    for (const [saved, expected] of cases) {
      let stored = saved;
      const attrs = {};
      const select = { value: '', addEventListener(name, callback) { this[name] = callback; } };
      const label = { textContent: '', getAttribute: () => 'welcomeScreen.start' };
      globalThis.localStorage = { getItem: () => stored, setItem(key, value) { assert.equal(key, 'lightbot_language'); stored = value; } };
      globalThis.document = {
        documentElement: { setAttribute(key, value) { attrs[key] = value; } },
        querySelectorAll: selector => selector === '[data-i18n]' ? [label] : [],
        getElementById: id => id === 'languageSelect' ? select : null,
      };
      i18next.off('languageChanged');
      await initI18n();
      assert.equal(attrs.lang, expected);
      assert.equal(select.value, expected);
      assert.equal(stored, expected);
      assert.equal(i18next.language, expected);
      assert.equal(label.textContent, i18next.t('welcomeScreen.start'));
      if (serbian[expected]) assert.equal(label.textContent, serbian[expected].welcomeScreen.start);
      for (const [language, resource] of Object.entries(serbian)) {
        select.value = language;
        select.change();
        await Promise.resolve();
        assert.equal(i18next.language, language);
        assert.equal(attrs.lang, language);
        assert.equal(stored, language);
        assert.equal(label.textContent, resource.welcomeScreen.start);
        for (const [count, suffix] of [[1, 'one'], [2, 'few'], [5, 'other'], [11, 'other'], [21, 'one'], [22, 'few']]) {
          assert.equal(i18next.t('dialogs.levelComplete.message', { count }), resource.dialogs.levelComplete[`message_${suffix}`].replace('{{count}}', count));
        }
      }
    }
  } finally {
    i18next.off('languageChanged');
    globalThis.document = savedDocument;
    if (savedStorage) Object.defineProperty(globalThis, 'localStorage', savedStorage);
    else delete globalThis.localStorage;
  }
});
