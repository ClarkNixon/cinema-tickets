const minSeats = 0;
const maxTickets = 20;

const Constants = {
    MinNumberOfSeats: minSeats,
    MaxNumberOfTickets: maxTickets,
    ExceptionMessages: {
        InvalidAccountId: "accountId is less than 0",
        InvalidAccountIdType: "accountId must be a number",
        InvalidNumberOfTickets: "noOfTickets must be a number",
        InvalidTicketType: "type of ticket requested is not valid",
        InvalidTicketTypeRequest: "request must be for at least 1 ticket",
        MinNumberOfSeats: `number of seats must be greater than ${minSeats}`,
        NotEnoughAdults: "an adult ticket is required to be purchased",
        TicketNotFound: "type of ticket not found",
        TooManyInfants: "more infant tickets requested than adult tickets",
        TooManyTickets: `number of tickets must be less than or equal to ${maxTickets}`,
        SeatAllocationError: "unable to allocate seat",
        PaymentError: "unable to process payment",
    },
    TicketType: {
        INFANT: "INFANT",
        CHILD: "CHILD",
        ADULT: "ADULT",
    },
};

Object.freeze(Constants);

export default Constants;
