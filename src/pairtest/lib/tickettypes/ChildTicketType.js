import Constants from "../Constants";
import BaseTicketType from "./BaseTicketType";

export default class ChildTicketType extends BaseTicketType {
    constructor() {
        super();
        this.setCost(10);
        this.setHasSeat(true);
        this.setTicketType(Constants.TicketType.CHILD);
    }
}
