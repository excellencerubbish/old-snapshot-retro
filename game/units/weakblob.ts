import { DamageEvent, GameEvent, NullEvent } from "game/event";
import { ID } from "game/util";
import { QueuedAction, ActionQueue } from "game/actionqueue";
import { Unit } from "game/unit";

export class WeakBlob extends Unit {
  constructor(id: ID) {
    super(1, 1, id);
  }
}
