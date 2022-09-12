import { ID } from "game/util";
import { Action, ActionQueue } from "game/actionqueue";
import {
  DamageEvent,
  DamageEventProps,
  GameEvent,
  NullEvent,
} from "game/event";
import { Unit } from "game/unit";

export class Dummy extends Unit {
  constructor(id: ID) {
    super(1, 1, id);

    // initialize event listeners
    this.addEventListener(DamageEvent, this.splinter);
  }

  // abilities
  private splinter(event: GameEvent) {
    const e = event as DamageEvent;
    const action: Action = () => {
      // if Dummy gets hurt, hurt the attacker for 1

      // if this unit was attacked
      if (this.id === e.target) {
        // get unit of source of attack
        const enemy = this.context!.getUnitByID(e.source);

        const data: DamageEventProps = {
          source: this.id,
          target: enemy.id,
          value: 1,
          turn: this.context!.getCurrentTurn(),
        };
        enemy.reduceHealth(1);
        return new DamageEvent(data);
      }
      return new NullEvent();
    };

    return action;
  }
}
