const Constants = {
    MinNumberOfSeats: 0,
    MaxNumberOfTickets: 20,
    TicketType: {
        Infant: {
            Name: "INFANT",
            Cost: 0,
            HasSeat: false,
        },
        Child: {
            Name: "CHILD",
            Cost: 10,
            HasSeat: true,
        },
        Adult: {
            Name: "ADULT",
            Cost: 20,
            HasSeat: true,
        },
    },
};

Object.freeze(Constants);

export default Constants;
