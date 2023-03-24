import Constants from "./Constants";
import Helpers from "../helpers/Helpers";

const ticketTypeNames = Helpers.TicketNameHelper();

const ExceptionMessages = {
    BaseTicketTypeError: "BaseTicketType class can't be instantiated.",
    InvalidAccountId: "accountId is less than 0",
    InvalidAccountIdType: "accountId must be a number",
    InvalidNumberOfTickets: "noOfTickets must be a number",
    InvalidTicketType: "type of ticket requested is not valid",
    InvalidTicketTypeRequest: "request must be for at least 1 ticket",
    MinNumberOfSeats: `number of seats must be greater than ${Constants.MinNumberOfSeats}`,
    NotEnoughAdults: "an adult ticket is required to be purchased",
    TicketNotFound: "type of ticket not found",
    TicketType: `type must be ${ticketTypeNames
        .slice(0, -1)
        .join(", ")}, or ${ticketTypeNames.slice(-1)}`,
    TooManyInfants: "more infant tickets requested than adult tickets",
    TooManyTickets: `number of tickets must be less than or equal to ${Constants.MaxNumberOfTickets}`,
    SeatAllocationError: "unable to allocate seat",
    PaymentError: "unable to process payment",
};

Object.freeze(ExceptionMessages);

export default ExceptionMessages;
