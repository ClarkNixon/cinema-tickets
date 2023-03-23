import Constants from "./Constants";
import AdultTicketType from "./tickettypes/AdultTicketType";
import ChildTicketType from "./tickettypes/ChildTicketType";
import InfantTicketType from "./tickettypes/InfantTicketType";
import TicketTypeNotFoundException from "./exceptions/TicketTypeNotFoundException";
import InvalidTicketTypeRequestException from "./exceptions/InvalidTicketTypeRequestException";

export default class TicketTypeRequest {
    #type;

    #noOfTickets;

    constructor(type, noOfTickets) {
        const ticketTypes = Object.keys(Constants.TicketType);
        if (!ticketTypes.includes(type)) {
            throw new TypeError(
                `type must be ${ticketTypes
                    .slice(0, -1)
                    .join(", ")}, or ${ticketTypes.slice(-1)}`
            );
        }

        if (!Number.isInteger(noOfTickets)) {
            throw new TypeError(
                Constants.ExceptionMessages.InvalidNumberOfTickets
            );
        }

        if (noOfTickets > Constants.MaxNumberOfTickets) {
            throw new InvalidTicketTypeRequestException(
                Constants.ExceptionMessages.TooManyTickets
            );
        }

        this.#setTicketTypeName(type);
        this.#setNoOfTickets(noOfTickets);
    }

    /**
     * get the number of tickets for request
     * @returns {Number} number of tickets
     */
    getNoOfTickets() {
        return this.#noOfTickets;
    }

    /**
     * set the number of tickets for request
     */
    #setNoOfTickets(noOfTickets) {
        this.#noOfTickets = noOfTickets;
    }

    /**
     * get the type of ticket for request
     * @returns {string} type of ticket
     */
    getTicketTypeName() {
        return this.#type;
    }

    /**
     * set the type of ticket for request
     */
    #setTicketTypeName(type) {
        this.#type = type;
    }

    /**
     * Get the ticket type
     * @returns {BaseTicketType}
     */
    getTicketType() {
        switch (this.#type) {
            case Constants.TicketType.ADULT: {
                return new AdultTicketType();
            }
            case Constants.TicketType.CHILD: {
                return new ChildTicketType();
            }
            case Constants.TicketType.INFANT: {
                return new InfantTicketType();
            }
            default: {
                throw new TicketTypeNotFoundException();
            }
        }
    }
}
