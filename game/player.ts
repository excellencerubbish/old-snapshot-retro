import { Team } from "game/team";
import { ID } from "game/event";

class Player {
  protected team: Team;
  protected shop: Shop;
  protected uuid: ID;

  constructor() {
    this.team = new Team([]);
    this.shop = new Shop();
    this.uuid = "";
  }
}
