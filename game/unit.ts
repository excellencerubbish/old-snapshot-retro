import { Action, QueuedAction } from "./actionqueue";
import {
  DamageEvent,
  GameEvent,
  GameEventCallback,
  GameEventListener,
  GameEventType,
  NewTurnEvent,
  TriggerBasicAttackEvent,
} from "game/event";
import { Game } from "game/game";
import { ID } from "./util";

/** Base Unit Class. Cannot be instantiated. */
export abstract class Unit {
  protected health: number;
  protected damage: number;

  readonly id: ID;

  // buffs only last during the round
  // should be reinitialized to 0 when a round ends in roundEnd
  // should damage dealt to this unit be part of this?
  protected healthBuff: number = 0;
  protected damageBuff: number = 0;

  // event listeners
  protected eventListeners: Array<
    GameEventListener<GameEvent, Action | QueuedAction>
  > = [];

  // game context
  protected context: Game | undefined;

  /* ------------------------------- Initializer ------------------------------ */

  constructor(health: number, damage: number, id: ID) {
    this.health = health;
    this.damage = damage;

    this.id = id;

    this.initEventListeners();
  }

  private initEventListeners() {
    this.addEventListener(TriggerBasicAttackEvent, this.attack);
  }

  roundStart() {}
  roundEnd() {
    this.healthBuff = 0;
    this.damageBuff = 0;
  }

  /* --------------------------------- Actions -------------------------------- */
  // actions should be protected members
  // actions should also accept an event OR no arguments
  // all context an action would need would either come from the Event
  // or the context Game object

  /**
   * basic attack event listener callback action.
   * @param target optional. unit to attack
   * @param value optional. attack damage. planning to make this deprecated
   * @returns Action.
   */
  protected attack(): Action {
    // init
    const target = this.context!.getOpposingTeam(this.id).getFrontUnit();

    // check if unit is in front

    return () => {
      // modifier
      target.reduceHealth(this.damage);

      // event
      return new DamageEvent({
        source: this.id,
        target: target.id,
        value: this.damage,
        turn: 0,
      });
    };
  }

  /* ----------------------------- Event Listeners ---------------------------- */

  /**
   * Adds a callback to the class that triggers when
   * the event passed in occurs.
   * @param type - Event Type
   * @param callback - Callback that returns an Action to be queued
   * @param [id] - Optional ID param. Does nothing, related to removeEventListener
   */
  public addEventListener(
    type: GameEventType<GameEvent>,
    callback: GameEventCallback<GameEvent, Action | QueuedAction>,
    id?: number
  ) {
    let e: GameEventListener<GameEvent, Action | QueuedAction>;
    if (id) {
      e = new GameEventListener(type, callback, id);
    } else {
      e = new GameEventListener(type, callback);
    }

    this.eventListeners.push(e);
  }

  /** Given a reference to an eventListener, remove it.
   * @param e evenLlistener to remove or number ID
   * @returns true if new eventlistener length is shorter
   */
  public removeEventListener(
    e: GameEventListener<GameEvent, Action | QueuedAction> | number
  ): boolean {
    const lastLength = this.eventListeners.length;

    if (Number.isInteger(e)) {
      this.eventListeners = this.eventListeners.filter(
        (eventListener) => e !== eventListener.id
      );
    } else {
      this.eventListeners = this.eventListeners.filter(
        (eventListener) => e !== eventListener
      );
    }
    let newLength = this.eventListeners.length;

    // if newlength = last length-1, removal was
    // successful
    return lastLength - 1 != newLength;
  }

  /**
   * Given an event, go through all event listeners
   * and run their corresponding callback if they match
   * @param event event to check for
   */
  public triggerEventListeners(event: GameEvent) {
    let actions = [];
    for (const eventListener of this.eventListeners) {
      if (event instanceof eventListener.type) {
        actions.push(eventListener.callback(event));
      }
    }
    return actions;
  }

  /**
   * checks if unit is listening for event.
   * @param event event to check
   * @returns true if unit has eventlistener of event type
   */
  public hasEventListener(event: GameEventType<GameEvent>): boolean {
    for (const eventListener of this.eventListeners) {
      if (event instanceof eventListener.type) {
        return true;
      }
    }
    return false;
  }

  /* --------------------------------- Getters -------------------------------- */
  public getHealth(): number {
    return this.health;
  }
  public getAttack(): number {
    return this.damage;
  }
  public getID(): string {
    return this.id;
  }

  /* --------------------------------- Setters -------------------------------- */
  public setContext(context: Game) {
    this.context = context;
  }

  public reduceHealth(value: number) {
    this.healthBuff = this.healthBuff - value;
  }

  public attackDebuff(value: number) {
    this.damageBuff = this.damageBuff - value;
  }
}
