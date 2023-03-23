import Constants from "../Constants";

export default class TicketTypeNotFoundException extends Error {
    constructor() {
        super();
        this.message = Constants.ExceptionMessages.TicketNotFound;
    }
}
