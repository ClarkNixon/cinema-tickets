import Constants from "../Constants";
import BaseTicketType from "./BaseTicketType";

export default class InfantTicketType extends BaseTicketType {
    constructor() {
        super();
        this.setCost(0);
        this.setHasSeat(false);
        this.setTicketType(Constants.TicketType.INFANT);
        // Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
    }
}
