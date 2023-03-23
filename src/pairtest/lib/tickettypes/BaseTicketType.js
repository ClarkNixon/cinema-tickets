export default class BaseTicketType {
    #cost;

    #hasSeat;

    #ticketType;

    constructor() {
        if (this.constructor === BaseTicketType) {
            throw new Error("BaseTicketType class can't be instantiated.");
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
