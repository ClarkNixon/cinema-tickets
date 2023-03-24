import Constants from "../constants/Constants";
import BaseTicketType from "./BaseTicketType";

export default class AdultTicketType extends BaseTicketType {
    constructor() {
        super();
        this.setCost(Constants.TicketType.Adult.Cost);
        this.setHasSeat(Constants.TicketType.Adult.HasSeat);
        this.setTicketType(Constants.TicketType.Adult.Name);
    }
}
