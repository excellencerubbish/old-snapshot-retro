import {
  GameEvent,
  NewTurnEvent,
  ActionEvent,
  NullEvent,
  ConfusedEvent,
  ConfusedEventProps,
} from "game/event";
import { Action } from "game/actionqueue";
import { Unit } from "game/unit";
import { ID } from "game/util";

export class Spy extends Unit {
  protected duration: number;
  protected debuff: number;

  constructor(id: ID) {
    super(3, 1, id);
    this.duration = 1;
    this.debuff = 1;
    this.addEventListener(NewTurnEvent, this.confuse);
    // this.addEventListener(NewTurnEvent);
  }

  protected confuse() {
    const action: Action = () => {
      const enemyTeam = this.context!.getOpposingTeam(this.id);
      const enemyUnits = enemyTeam.getUnits();

      const res: GameEvent[] = [];
      for (const unit of enemyUnits) {
        // if unit already has event id
        if (!unit.hasEventListener(ConfusedEvent)) {
          const id: number = this.context!.getUniqueEventID();
          unit.addEventListener(ConfusedEvent, this.confusedStatusEffect, id);
          res.push(
            new ConfusedEvent({
              source: this.id,
              target: unit.id,
              duration: this.duration,
              turn: this.context!.getCurrentTurn() + 1,
              id: id,
              // eventListenerID: id,
            })
          );
        }
      }
      return res;
    };

    return action;
  }

  // status effects
  protected confusedStatusEffect(event: GameEvent) {
    const e = event as ConfusedEvent;
    const action: Action = () => {
      const targetID = e.target;
      const unit = this.context!.getUnitByID(targetID);

      //cleanup
      if (e.duration === 0) {
        unit.removeEventListener(e.id);
        return new NullEvent();
      }

      unit.attackDebuff(this.debuff);

      return new ConfusedEvent({
        source: e.source,
        target: e.target,
        duration: e.duration - 1,
        turn: this.context!.getCurrentTurn() + 1,
        id: e.id,
      });
    };

    return action;
  }
}
