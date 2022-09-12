import { DamageEvent, GameEvent } from "./event";
import { ID } from "./util";

interface EventLogType {
  [i: number]: Array<GameEvent>;
}

export class EventLog {
  protected log: EventLogType;
  protected pendingEvents: EventLogType;

  constructor() {
    this.log = {};
    this.pendingEvents = {};
  }

  /**
   *
   * @param turn
   * @returns true if successfully added. otherwise
   * returns false if turn already exists.
   */
  private newLog(turn: number): boolean {
    // log already exists.
    if (this.log[turn]) {
      return false;
    } else {
      this.log[turn] = [];
      this.pendingEvents[turn] = [];
    }

    return true;
  }

  /**
   * Adds event to pending events.
   * @param event to be added
   */
  public push(event: GameEvent | Array<GameEvent>) {
    if (Array.isArray(event)) {
      for (const e of event) {
        const t = e.turn;
        this.newLog(t);
        this.pendingEvents[t].push(e);
      }
    } else {
      const t = event.turn;
      this.newLog(t);
      this.pendingEvents[t].push(event);
    }
  }

  /**
   * Get event history array for the specified turn.
   * @param turn get events of that turn
   * @returns event array
   */
  public getEventHistory(turn: number): Array<GameEvent> {
    if (this.log[turn]) {
      return this.log[turn];
    } else {
      return [];
    }
  }

  /**
   * Get pending events that have not yet been consumed.
   * Once the events have been popped from pending, they are concated to the log
   * @param turn get pending events of that turn
   * @returns event array
   */
  public popPendingEvents(turn: number): Array<GameEvent> {
    if (this.log[turn]) {
      // creating new array because resetting pending events
      const res = [...this.pendingEvents[turn]];
      this.pendingEvents[turn] = [];

      // updating log
      this.log[turn].concat(...res);

      return res;
    } else {
      return [];
    }
  }

  public getPendingEventsLength(turn: number): number {
    return this.log[turn] ? this.log[turn].length : 0;
  }

  private getLog(): EventLogType {
    return this.log;
  }

  public getLastDamageEvent(id: ID): DamageEvent | undefined {
    // get largest index
    let testInd = 0;
    while (this.log[testInd + 1] !== undefined) {
      testInd += 1;
    }
    // loop through each turn
    for (let i = testInd; i >= 0; i--) {
      // loop through each event in each turn
      // eslint-disable-next-line for-direction
      for (let j = this.log[i].length; j < this.log[i].length; j--) {
        const e = this.log[i][j];
        if (e instanceof DamageEvent) {
          const event = e as DamageEvent;
          if (event.target === id) {
            return event;
          }
        }
      }
    }
    return undefined;
  }
}
