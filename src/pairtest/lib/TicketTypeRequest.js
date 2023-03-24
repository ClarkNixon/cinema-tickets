import Constants from "./constants/Constants";
import ExceptionMessages from "./constants/ExceptionMessages";
import AdultTicketType from "./tickettypes/AdultTicketType";
import ChildTicketType from "./tickettypes/ChildTicketType";
import InfantTicketType from "./tickettypes/InfantTicketType";
import TicketTypeNotFoundException from "./exceptions/TicketTypeNotFoundException";
import InvalidTicketTypeRequestException from "./exceptions/InvalidTicketTypeRequestException";
import Helpers from "./helpers/Helpers";

export default class TicketTypeRequest {
    #type;

    #noOfTickets;

    constructor(type, noOfTickets) {
        const ticketTypeNames = Helpers.TicketNameHelper();
        if (!ticketTypeNames.includes(type)) {
            throw new TypeError(ExceptionMessages.TicketType);
        }

        if (!Number.isInteger(noOfTickets)) {
            throw new TypeError(ExceptionMessages.InvalidNumberOfTickets);
        }

        if (noOfTickets > Constants.MaxNumberOfTickets) {
            throw new InvalidTicketTypeRequestException(
                ExceptionMessages.TooManyTickets
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
            case Constants.TicketType.Adult.Name: {
                return new AdultTicketType();
            }
            case Constants.TicketType.Child.Name: {
                return new ChildTicketType();
            }
            case Constants.TicketType.Infant.Name: {
                return new InfantTicketType();
            }
            default: {
                throw new TicketTypeNotFoundException();
            }
        }
    }
}
