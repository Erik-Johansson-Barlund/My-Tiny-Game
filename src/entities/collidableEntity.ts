import { Entity } from "./entity";

export interface CollidableEntity extends Entity {
  getBounds(): { x: number; y: number; width: number; height: number };
}
