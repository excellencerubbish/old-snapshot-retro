import { GameEvent, NullEvent } from "./event";

export class ActionQueue {
  protected queue: Array<QueuedAction>;

  constructor() {
    this.queue = [];
  }

  public enqueue(
    action: QueuedAction | Action | (QueuedAction | Action)[]
  ): void {
    if (action instanceof QueuedAction) {
      this.queue.push(action);
    } else if (Array.isArray(action)) {
      for (const a of action) {
        this.enqueue(a);
      }
    } else {
      // action
      this.queue.push(new QueuedAction(action));
    }
  }

  public dequeue(): QueuedAction | undefined {
    return this.queue[0];
  }

  public count(): number {
    return this.queue.length;
  }
}

// justification for using actions rather than
// just calling hurt() this way, we sepearte
// modifiers from events and only actions are
// responsible for managing events
// this way, developers writing unit code are only concerned
// with the unit, and not any logging related details
// even though its a bit clunky to have closures returning events
// it makes it easier to debug because we know for certain where events
// are created. either through an attack or a temporal trigger.
// events are cause and effect. either the unit is the cause or the game is the cause.
// how to deal with null or undefined actions.

// actions MUST return a game event, this way, units do not need to deal
// with events, only the game does
export type Action = { (...args: any[]): GameEvent | NullEvent };
export class QueuedAction {
  readonly action: Action;

  constructor(action: Action) {
    this.action = action;
  }

  public run() {
    return this.action();
  }
}
