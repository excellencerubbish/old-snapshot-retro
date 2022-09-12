import { Unit } from "./unit";
import { ID } from "./util";

export class Team {
  protected units: Array<Unit>;
  protected deadUnits: Array<Unit>;

  // consider adding array of dead units here ?

  constructor(units: Array<Unit>) {
    this.units = units;
    this.deadUnits = [];
  }

  /** checks if at least one unit is alive
   * @returns true if >= 1 unit is alive
   */
  public isAlive() {
    for (const unit of this.units) {
      if (unit.getHealth() > 0) {
        return true;
      }
    }
    return false;
  }

  /** gets frontliner unit (unit that does default attack)
   * @returns unit at front
   */
  public getFrontUnit(): Unit {
    return this.units[0];
  }

  /** round end. called by the game */
  public roundEnd() {
    for (const unit of this.units) {
      unit.roundEnd();
    }
  }

  /**
   * Returns true if unit is in team
   * @param id unit id to find
   * @returns true if unit in team
   */
  public inTeam(id: ID): boolean {
    for (const unit of this.units) {
      if (unit.id === id) {
        return true;
      }
    }
    return false;
  }

  public getUnitByID(id: ID): Unit {
    for (const unit of this.units) {
      if (unit.id === id) {
        return unit;
      }
    }
    throw "Unit not in team. Error should not be possible";
  }

  public removeUnitByID(id: ID): boolean {
    let didChange = false;

    // filter out the unit and re set the array
    // source: https://stackoverflow.com/a/20690490
    this.units = this.units.filter((unit) => {
      if (unit.id !== id) {
        // add unit to deadUnits
        this.deadUnits.push(unit);
        return true;
      }
      return false;
    });

    if (didChange) {
      return true;
    } else {
      return false;
    }
  }

  public getUnits(): Array<Unit> {
    return this.units;
  }
}
