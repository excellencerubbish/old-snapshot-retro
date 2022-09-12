import { Action } from "./actionqueue";
import { ID, Newable } from "./util";

// should this be all caps?
enum Buff {
  HEALTH,
  DAMAGE,
  DEFENSE,
}

/** Null Event, when a callback does not execute its ability */
export class NullEvent {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}

/**  */
interface GameEventProps {
  turn: number;
}

export interface ActionEvent extends GameEventProps {
  source: ID;
  target: ID;
}

export interface StatusEffectEvent {
  id: number;
  duration: number;
  // eventListenerID: number;
}

/** Base Game Event
 * @param turn turn # that the event occurs in
 */
export class GameEvent implements GameEventProps {
  readonly turn: number;

  constructor(turn?: number) {
    this.turn = turn || -1;
  }
}

export class NewTurnEvent extends GameEvent {
  constructor(turn: number) {
    super(turn);
  }
}

export class TriggerBasicAttackEvent extends GameEvent {
  constructor(turn: number) {
    super(turn);
  }
}

export interface KilledEventProps extends ActionEvent {
  readonly dummydata: number;
}
/** Event that occurs when a unit makes a unit's health is <=0
 * @param target victim, unit that just died
 * @param source aggressor, unit that killed the victim
 * @param [turn] optional turn # that the event occurs in
 */
export class KilledEvent extends GameEvent implements KilledEventProps {
  readonly source: ID;
  readonly target: ID;
  dummydata: number;

  constructor(data: KilledEventProps) {
    super(data.turn);

    this.dummydata = 1;
    this.source = data.source;
    this.target = data.target;
  }
}

export interface BuffEventProps extends ActionEvent {
  buff: Buff;
  value: number;
}
/** Event that occurs when a unit buffs another one
 * @param source source of buff
 * @param target unit that got buffed
 * @param buff buff type
 * @param value amount buffed of buff type
 */
export class BuffEvent extends GameEvent implements BuffEventProps {
  readonly source: ID;
  readonly target: ID;

  readonly buff: Buff;
  readonly value: number;

  constructor(data: BuffEventProps) {
    super(data.turn);

    this.source = data.source;
    this.target = data.target;
    this.buff = data.buff;
    this.value = data.value;
  }
}

export interface DamageEventProps extends ActionEvent {
  value: number;
}
/** Event that occurs when a Unit is damaged
 * @param source aggressor
 * @param target victim
 * @param value amount damaged
 */
export class DamageEvent extends GameEvent implements DamageEventProps {
  readonly source: ID;
  readonly target: ID;

  readonly value: number;

  constructor(data: DamageEventProps) {
    super(data.turn);

    this.source = data.source;
    this.target = data.target;
    this.value = data.value;
  }
}

export interface PoisonEventProps extends ActionEvent {
  duration: number;
  value: number;
}
/** Event that occurs when Poison is inflicted/ongoing
 * @param source unit source of poison
 * @param target unit that is suffering
 * @param duration turns remaining that this status effect is active
 * @param value amount of damage to deal when event occurs
 */
export class PoisonEvent extends GameEvent implements PoisonEventProps {
  readonly source: ID;
  readonly target: ID;

  readonly duration: number;
  readonly value: number;

  constructor(data: PoisonEventProps) {
    super(data.turn);

    this.source = data.source;
    this.target = data.target;
    this.duration = data.duration;
    this.value = data.value;
  }
}

export interface ConfusedEventProps extends ActionEvent, StatusEffectEvent {}

export class ConfusedEvent extends GameEvent implements ConfusedEventProps {
  readonly duration: number;
  readonly source: string;
  readonly target: string;
  readonly id: number;
  // readonly eventListenerID: number;

  constructor(data: ConfusedEventProps) {
    super(data.turn);
    this.id = data.id;
    this.duration = data.duration;
    this.source = data.source;
    this.target = data.target;
    // this.eventListenerID = data.eventListenerID;
  }
}

/** print event */
export const printEvent = (e: GameEvent): void => {
  if (e instanceof KilledEvent) {
    console.log();
  }
};

/* ------------------------ Game Event Listener Types ----------------------- */

export type GameEventType<EventType> = Newable<EventType>;
export type GameEventCallback<EventType, CallBackReturnType> = (
  event: EventType
) => CallBackReturnType | (() => CallBackReturnType);

/** GameEventListener Pair
 * @param type type of event to listen for
 * @param callback
 */
export class GameEventListener<EventType, CallBackReturnType> {
  readonly type: GameEventType<EventType>;
  readonly callback: GameEventCallback<EventType, CallBackReturnType>;
  readonly id: number | undefined;
  constructor(
    type: GameEventType<EventType>,
    callback: GameEventCallback<EventType, CallBackReturnType>,
    id?: number
  ) {
    this.type = type;
    this.callback = callback;
    this.id = id;
  }
}
