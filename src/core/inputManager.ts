export class InputManager {
  private keys: Record<string, boolean> = {};

  keyDown(e: KeyboardEvent) {
    this.keys[e.key] = true;
  }

  keyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  isKeyDown(key: string): boolean {
    return !!this.keys[key];
  }
}
