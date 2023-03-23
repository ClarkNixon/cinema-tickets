import Constants from "../Constants";
import BaseTicketType from "./BaseTicketType";

export default class AdultTicketType extends BaseTicketType {
    constructor() {
        super();
        this.setCost(20);
        this.setHasSeat(true);
        this.setTicketType(Constants.TicketType.ADULT);
    }
}
