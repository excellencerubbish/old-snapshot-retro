class Shop {
  constructor() {}
}

/**
 * we went from a preturn -> turn -> postturn
 * to
 * preturn -> turn
 * because we realized post turn is basically next turn's preturn, and that what belongs
 * in each function is ambiguous.
 *
 * then from that to
 * preturn -> turn + listeners
 * because we still needed an abstraction of listeners in order to implement some abiities.
 *
 * to
 * eventListeners + turn
 * while writing out necessary contexts + listeners i realized that what we had before with temporal stuff
 * was still a bit ambiguous in terms of where to implement stuff.
 * so now, whenever a temporal "event" occurs, it is treated as an event.
 * then we attach eventlisteners, inspired by the design of DOM event listeners.
 *
 * this way nothing is really ambiguous.
 *
 * something that required some thought is when to "refresh" or "update" the board.
 * as some may notice, in special cases a pet is still "active" even when it's supposed to be dead.
 * this is due to an issue with global ordering, nothing can be truly simultaneous.
 *
 * no need for roundStart, just round 0
 * but we do need roundEnd because it asks a cleanup to remove any unwanted sideeffects
 */
