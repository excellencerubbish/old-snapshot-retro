import { ActionQueue } from "./actionqueue";
import {
  DamageEvent,
  GameEvent,
  KilledEvent,
  NewTurnEvent,
  TriggerBasicAttackEvent,
} from "./event";
import { EventLog } from "./eventlog";
import { GameState } from "./gamestate";
import { Team } from "./team";
import { Unit } from "./unit";
import { ID } from "./util";

export class Game {
  readonly leftTeam: Team;
  readonly rightTeam: Team;

  protected eventLog: EventLog;
  protected gameState: Array<GameState> = [];

  protected actionQueue: ActionQueue;

  protected currentTurn: number = 0;
  readonly maxActionPerTurn: number = 100;

  private eventIdCount = 0;

  constructor(leftTeam: Team, rightTeam: Team) {
    this.leftTeam = leftTeam;
    this.rightTeam = rightTeam;

    this.actionQueue = new ActionQueue();
    this.eventLog = new EventLog();
  }

  // events should cause actions to be queued up
  // actions should cause events to be queued up

  /** Once initialized, battle
   * runs a game and returns the team that won
   * @returns team that won
   */
  public battle() {
    // both teams must be alive to battle
    this.currentTurn = -1;
    while (this.leftTeam.isAlive() && this.rightTeam.isAlive()) {
      // restart
      this.currentTurn += 1;
      this.eventLog.push(new NewTurnEvent(this.currentTurn));

      // check for dead enemies
      this.refresh();

      // status effect events and death events
      // from last round get triggered prior to temporal abilities
      this.preTurn();

      // basic attack
      this.turn();

      // consume eventlog and actions repeatedly until there are none left
      this.postTurn();
    }

    // game end

    // tie
    if (!this.leftTeam.isAlive() && !this.rightTeam.isAlive()) {
      return 0;
    }

    // left team wins
    if (this.leftTeam.isAlive()) {
      return -1;
    }

    // right team wins
    if (this.rightTeam.isAlive()) {
      return 1;
    }
  }

  /* -------------------------------- Lifecycle ------------------------------- */
  /** roundstart lifecycle event. No game logic
   * should occur here.
   */
  protected roundStart() {}

  /** preturn lifecycle event.
   * temporal event is triggered here and any resulting
   * abilities are consumed here.
   */
  protected preTurn() {
    this.consumeEvents();
    this.consumeActions();
    // let leftUnit = this.leftTeam.getFrontUnit();
    // let rightUnit = this.rightTeam.getFrontUnit();

    // // check if units are not undefined
    // if (!leftUnit || !rightUnit) {
    //   console.log("ERROR. Some team has no unit in preturn.");
    // }
  }

  /** turn lifecycle event
   * basic attack is "triggered" here
   */
  protected turn() {
    this.eventLog.push(new TriggerBasicAttackEvent(this.currentTurn));
    this.consumeEvents();
    this.consumeActions();
  }
  /** postturn lifecycle event.
   * abilities in response to basic attacks are consumed here.
   * additionally, any abilities in response to those abilities
   * are consumed here as well until there are no remaining
   * queued actions.
   */
  protected postTurn() {
    // as long as there are pending events or actions, keep executing
    while (
      this.eventLog.getPendingEventsLength(this.currentTurn) > 0 ||
      this.actionQueue.count() > 0
    ) {
      this.consumeEvents();
      this.consumeActions();
    }
  }

  /** roundend lifecycle event. Acts as a cleanup function.
   *
   * No game logic should occur here other than
   * end of game abilities
   */
  protected roundEnd() {
    this.leftTeam.roundEnd();
    this.rightTeam.roundEnd();
  }

  /* --------------------------------- Helpers -------------------------------- */
  private consumeEvents() {
    let events = this.eventLog.popPendingEvents(this.currentTurn);
    let i = 0;
    while (i < events.length) {
      let currentEvent = events[i];
      let pendingActions = [];
      for (const unit of this.getUnits()) {
        pendingActions = unit.triggerEventListeners(currentEvent);
        this.actionQueue.enqueue(pendingActions);
      }

      if (
        i + this.eventLog.getEventHistory(this.currentTurn).length >
        this.maxActionPerTurn
      ) {
        // figure out how to end game here
        console.log("max turn reached");
        return;
      }
    }
  }

  private consumeActions() {
    while (this.actionQueue.count() > 0) {
      let action = this.actionQueue.dequeue();
      let event = action!.run();

      // as opposed to NullEvent
      if (event instanceof GameEvent) {
        this.eventLog.push(event);
      }
    }
  }

  /** touches all units and any units that
   * have negative health are killed / discarded.
   *
   * This should occur after every **core** lifecycle
   * event:
   * - preturn
   * - turn
   * - postturn
   */
  private refresh() {
    for (const unit of this.getUnits()) {
      // if unit is dead
      if (unit.getHealth() <= 0) {
        let team = this.getTeamByUnitID(unit.id);
        // remove it from the team
        team.removeUnitByID(unit.id);
        // check what killed the unit by getting the last event it got damaged
        // damage event MUST proc even was ability
        let e = this.eventLog.getLastDamageEvent(unit.id);
        if (e === undefined) {
          throw "how die without getting damaged?";
        } else if (e instanceof DamageEvent) {
          this.eventLog.push(
            new KilledEvent({
              target: unit.id,
              source: e.source,
              turn: this.currentTurn,
            })
          );
        }
      }
    }
  }

  /* ---------------------------------- Util ---------------------------------- */
  public getCurrentTurn() {
    return this.currentTurn;
  }

  public getOpposingTeam(id: ID): Team {
    if (this.leftTeam.inTeam(id)) {
      return this.rightTeam;
    }

    if (this.rightTeam.inTeam(id)) {
      return this.leftTeam;
    }

    throw "Unit not in the game.";
  }

  public getTeamByUnitID(id: ID): Team {
    if (this.leftTeam.inTeam(id)) {
      return this.leftTeam;
    }

    if (this.rightTeam.inTeam(id)) {
      return this.rightTeam;
    }

    throw "Unit not in the game";
  }

  public getUnitByID(id: ID): Unit {
    if (this.leftTeam.inTeam(id)) {
      return this.leftTeam.getUnitByID(id);
    }

    if (this.rightTeam.inTeam(id)) {
      return this.rightTeam.getUnitByID(id);
    }

    throw "Unit not in the game.";
  }

  public getUnits(): Array<Unit> {
    let res = [];

    for (const unit of this.leftTeam.getUnits()) {
      res.push(unit);
    }

    for (const unit of this.rightTeam.getUnits()) {
      res.push(unit);
    }
    return res;
  }

  public getUniqueEventID(): number {
    return this.eventIdCount++;
  }
}
