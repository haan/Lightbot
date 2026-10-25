import test from 'node:test';
import assert from 'node:assert/strict';
import { createBox } from '../src/lightbot/lightbot.model.box.js';
import { createLightBox } from '../src/lightbot/lightbot.model.lightbox.js';
import { createMap } from '../src/lightbot/lightbot.model.map.js';
import { createDirections } from '../src/lightbot/lightbot.model.directions.js';
import { Projection } from '../src/lightbot/lightbot.view.canvas.projection.js';
import { extendBoxView } from '../src/lightbot/lightbot.view.canvas.box.js';
import { canvasView } from '../src/lightbot/lightbot.view.canvas.game.js';

function context() {
  const stack = [];
  return {
    globalAlpha: 1, shadowBlur: 0, shadowColor: '', fillStyle: '', strokeStyle: '', lineWidth: 1,
    fills: [], strokes: [], transforms: [], translations: [],
    save() { stack.push(Object.fromEntries(['globalAlpha', 'shadowBlur', 'shadowColor', 'fillStyle', 'strokeStyle', 'lineWidth'].map(key => [key, this[key]]))); },
    restore() { Object.assign(this, stack.pop()); },
    beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, clearRect() {}, scale() {},
    fill() { this.fills.push({ color: this.fillStyle, alpha: this.globalAlpha, blur: this.shadowBlur }); },
    stroke() { this.strokes.push({ color: this.strokeStyle, alpha: this.globalAlpha }); },
    setTransform(...values) { this.transforms.push(values); },
    translate(...values) { this.translations.push(values); },
  };
}

function drawingModel(ctx) {
  const Box = createBox();
  const LightBox = createLightBox({ Box });
  const bot = { init() {}, direction: 0, currentPos: { x: -1, y: -1 } };
  const map = createMap({ Box, LightBox, bot });
  const app = { ctx, bot, map, Projection, directions: createDirections(), projection: new Projection(620, 310, 100) };
  extendBoxView({ app, Box, LightBox });
  map.loadMap(0);
  return { app, Box, LightBox };
}

test('face lighting and softened edges preserve theme colors and restore drawing state', () => {
  globalThis.document = { documentElement: {} };
  for (const surface of ['#163b40', '#eeeeee']) {
    globalThis.window = { getComputedStyle: () => ({ getPropertyValue: name => name === '--color-base-200' ? surface : '#aaaaaa' }) };
    const ctx = context();
    const { Box } = drawingModel(ctx);
    new Box(2, 0, 0).draw();
    assert.deepEqual(ctx.fills.map(fill => fill.color), [surface, '#ffffff', surface, '#000000', surface, '#000000']);
    assert.deepEqual(ctx.fills.map(fill => fill.alpha), [1, 0.07, 1, 0.24, 1, 0.10]);
    assert.ok(ctx.strokes.every(stroke => stroke.alpha > 0 && stroke.alpha < 0.5));
    assert.equal(ctx.globalAlpha, 1);
    assert.equal(ctx.shadowBlur, 0);
  }
});

test('only lit panels emit light and their glow never leaks into later faces', () => {
  const ctx = context();
  const { LightBox } = drawingModel(ctx);
  const tile = new LightBox(1, 0, 0);
  tile.draw();
  assert.ok(ctx.fills.every(fill => fill.blur === 0));
  assert.ok(ctx.fills.some(fill => fill.color === '#0468fb'));
  ctx.fills = [];
  tile.lightOn = true;
  tile.draw();
  assert.deepEqual(ctx.fills.filter(fill => fill.blur > 0).map(fill => fill.color), ['#FFE545']);
  assert.equal(ctx.globalAlpha, 1);
  assert.equal(ctx.shadowBlur, 0);
});

test('high-density backing pixels do not change projection or board framing', () => {
  globalThis.window.devicePixelRatio = 2;
  const ctx = context();
  const { app } = drawingModel(ctx);
  const canvas = { width: 620, height: 620, getContext: () => ctx };
  canvasView(app, canvas);
  const projected = app.projection.project(50, 25, 50);
  app.draw();
  assert.equal(canvas.width, 1240);
  assert.equal(canvas.height, 1240);
  assert.deepEqual(ctx.transforms.at(-1), [2, 0, 0, 2, 0, 0]);
  const framing = ctx.translations.at(-1);
  globalThis.window.devicePixelRatio = 1;
  app.draw();
  assert.equal(canvas.width, 620);
  assert.deepEqual(ctx.transforms.at(-1), [1, 0, 0, 1, 0, 0]);
  assert.deepEqual(ctx.translations.at(-1), framing);
  assert.deepEqual(app.projection.project(50, 25, 50), projected);
});
