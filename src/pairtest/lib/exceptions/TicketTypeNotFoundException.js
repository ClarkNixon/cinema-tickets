import ExceptionMessages from "../constants/ExceptionMessages";

export default class TicketTypeNotFoundException extends Error {
    constructor() {
        super();
        this.message = ExceptionMessages.TicketNotFound;
    }
}
