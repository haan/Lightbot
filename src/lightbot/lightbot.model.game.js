// Minimal shared state for the whole game.
// Other modules attach services/objects to the `app` instance created from this shell.

export function createAppShell() {
  return {
    speedMultiplier: 1.0, // 1.0 is normal speed, < 1.0 is slower, > 1.0 is faster
  };
}
