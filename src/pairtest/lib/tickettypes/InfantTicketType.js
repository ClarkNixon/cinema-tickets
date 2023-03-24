import Constants from "../constants/Constants";
import BaseTicketType from "./BaseTicketType";

export default class InfantTicketType extends BaseTicketType {
    constructor() {
        super();
        this.setCost(Constants.TicketType.Infant.Cost);
        this.setHasSeat(Constants.TicketType.Infant.HasSeat);
        this.setTicketType(Constants.TicketType.Infant.Name);
        // Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
        Object.freeze(this);
    }
}
