import Constants from "../constants/Constants";
import BaseTicketType from "./BaseTicketType";

export default class ChildTicketType extends BaseTicketType {
    constructor() {
        super();
        this.setCost(Constants.TicketType.Child.Cost);
        this.setHasSeat(Constants.TicketType.Child.HasSeat);
        this.setTicketType(Constants.TicketType.Child.Name);
        Object.freeze(this);
    }
}
