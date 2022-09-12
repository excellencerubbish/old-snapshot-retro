class Counter {
  count = 0;
  consructor() {}
  inc() {
    this.count += 1;
  }
  dec() {
    this.count -= 1;
  }
  closur() {
    let a = () => {
      return this.count;
    };

    return a;
  }
}

// event listener
// order of union types matter
// the issue i was having: https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters-in-callbacks
// should we have ids? remove and add event listeners

/**
 * GETTERS!!
 */

// listeners
// these methods trigger abilities
// should every pet implement all listeners for standardization reasons?

// important to keep listener stuff separate from modifier?

// modifiers
// these methods modify properties of Pet
// should it return true if animal dies?

//  export type By<Key extends string | number | symbol, Value> = {
//   [key in Key]: Value;
// };
// export type ByTier<T> = By<Tier, T>;
// export type ByPack<T> = By<Pack, T>;

// todo
/**
 * generics
 * func<T extends Type> (param: T[]): ByTier<T>
 *
 * optional interface
 *
 * go through list of all listeners
 * context
 * flowchart all types
 * java graph thing for javascript
 *
 * obsidian programmatic flowcharter
 *
 * goal, write modular code such that it's easy to add onto the codbase without requiring extensive
 * knowledger
 */

// abilities and attack should directly modify whatever unit they're affecting.
// hurt() vs attack() for example

// one way to prevent inf loops is to literally just have abilities proc once
// per turn only
// do this by checking if event has already occured during turn
// eg. hasAlreadyProcd(event, source)

// suggestion: all reactive/applicative events
// eg. one unit does something to another
// implements a cause effect (need a better name) [action event] interface where
// source and target are required

// temporal events don't need to do so

// major changes
// in the future i will be more organized w/ commits
// so there isn't a huge thing to parse through
// 1. move action stuff to actionqueue
// 2. unit.attack -> unit.damage so unit.attack() can be a thing lol
// 3. jsdoc for events
// 4. new event interface -> ActionEvent
// this reduces ambiguity from (killer -> killed or agressor -> victim)
// to something more standard: source -> target
// 5. reduce naming conventions. always aware of how to read
// and can programmatically read events. better for coding
// event logs. reduce confusion when writing logs.
// 6. event constructor only takes in a data object in favor of
// many parameters. this way we can have multiple optional parameters
// if needed
// 7. gameevent.turn is now required
// 8. we have event extends gameevent implements <x>
// so we can have data:<x> to force parameters
// 9. Unit.removeEventListener *should* work lol. returns true if removed
// 10. function signature of printEvent (for logging purposes)
// 11. if we wanted break unit down further, could move all the eventListener
// stuff into a separate class. if we do that, we can move the eventlistener
// types from event.ts to a new file
// 12. Added a PoisonEvent
// 13. Separate PoisonEvent into ApplyPoisonEvent & PoisonStatusEvent?
// we would extend StatusEvent instead of ActionEvent.
// though currently i don't see the need to make this distinction.
// 14. clean up lifecycle functions in Unit. remove preturn and turn.
// 15. added game lifecycle functions
// 16. Unit.attack can accept either an ID or an Unit
// 17. Unit.attack is strictly reserved for Game or
// abilities that strictly have "attack" again. it should be
// considered the defaultAttack. This is because attack returns
// an action. and any actions that call attack will not actually
// proc. any ability that deals damage should directly modify the
// Unit via Unit.reduceHealth(val:number)

// maybe attack shouldn't be called, it should be an eventlistener
// listens for newTurnEvent?
// javascript how to make a copy of a function
// this way any status effect that prevents attack literally
// just removes the event listener, and the status effect's cleanup
// puts the eventlistener back
// maybe status effect should be a separate object from
// gameevent with a cleanup function
// should it extend it ?

// order of ops
// preturn (start of turn abilities, then status effects)
// or other way around?
// turn (basic attacks [procd after new turn has been pushed])
// post turn (consume eventlog continusously until there are no actions)

// testrun on paper

// sonic

// events are good because the funnel information into one place
// rather than having multiple places call one function, we just
// put it into one place so units don't miss out on that contexts.

// what context does a unit have access to?

// add default eventlisteners
// clear event listeners

// two arrays, one for events being consumed
// one for new events
// this way when we don't modify an array while looping it

// i can theoretically make actionqueue static
// as idt we are running more than one game at once right?
// at least not per instance
// we can run an instance per game or player, but idk.


// things to test for, order of the team
// no proper exit is implemented for infitnite loop
// current implementation in consumeEvents