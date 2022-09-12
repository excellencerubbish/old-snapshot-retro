import { DamageEvent, GameEvent, NullEvent } from "game/event";
import { ID } from "game/util";
import { QueuedAction } from "game/actionqueue";
import { Unit } from "game/unit";

export class StrongBlob extends Unit {
  constructor(id: ID) {
    super(4, 4, id);
  }
}
