import ExceptionMessages from "../constants/ExceptionMessages";

export default class BaseTicketType {
    #cost;

    #hasSeat;

    #ticketType;

    constructor() {
        if (this.constructor === BaseTicketType) {
            throw new Error(ExceptionMessages.BaseTicketTypeError);
        }
    }

    getCost() {
        return this.#cost;
    }

    setCost(cost) {
        this.#cost = cost;
    }

    getHasSeat() {
        return this.#hasSeat;
    }

    setHasSeat(hasSeat) {
        this.#hasSeat = hasSeat;
    }

    getTicketType() {
        return this.#ticketType;
    }

    setTicketType(ticketType) {
        this.#ticketType = ticketType;
    }
}
