// import TicketTypeRequest from "./lib/TicketTypeRequest";
import InvalidPurchaseException from "./lib/exceptions/InvalidPurchaseException";
import InvalidPaymentException from "./lib/exceptions/InvalidPaymentException";
import InvalidReservationException from "./lib/exceptions/InvalidReservationException";
import Constants from "./lib/constants/Constants";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService";
import ExceptionMessages from "./lib/constants/ExceptionMessages";

export default class TicketService {
    /**
     * Purchase a ticket
     * @param {Number} accountId
     * @param  {TicketTypeRequest[]} ticketTypeRequests
     * @throws {InvalidPurchaseException}
     */
    purchaseTickets(accountId, ticketTypeRequests) {
        if (!Number.isInteger(accountId)) {
            throw new TypeError(ExceptionMessages.InvalidAccountIdType);
        }

        if (accountId <= 0) {
            // All accounts with an id greater than zero are valid. They also have sufficient funds to pay for any number of tickets.
            throw new InvalidPurchaseException(
                ExceptionMessages.InvalidAccountId
            );
        }

        if (ticketTypeRequests.length <= 0) {
            // Must have request for ticket to progress
            throw new InvalidPurchaseException(
                ExceptionMessages.InvalidTicketTypeRequest
            );
        }

        this.#progressWithPurchase(accountId, ticketTypeRequests);
    }

    /**
     * Continue the purchase
     * @param {Number} accountId
     * @param {TicketTypeRequest[]} ticketTypeRequests
     * @throws {InvalidPurchaseException}
     */
    #progressWithPurchase(accountId, ticketTypeRequests) {
        let adultTickets = 0;
        let childTickets = 0;
        let infantTickets = 0;

        let cost = 0;

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < ticketTypeRequests.length; i++) {
            const ticketCount = ticketTypeRequests[i].getNoOfTickets();
            const ticketType = ticketTypeRequests[i].getTicketType();
            const ticketTypeName = ticketTypeRequests[i].getTicketTypeName();
            const ticketCost = ticketType.getCost() * ticketCount;

            cost += ticketCost;

            switch (ticketTypeName) {
                case Constants.TicketType.Adult.Name: {
                    adultTickets += ticketCount;
                    break;
                }
                case Constants.TicketType.Child.Name: {
                    childTickets += ticketCount;
                    break;
                }
                case Constants.TicketType.Infant.Name: {
                    infantTickets += ticketCount;
                    break;
                }
                default: {
                    // exception already thrown in TicketTypeRequest constructor for invalid Ticket Type
                    throw new InvalidPurchaseException(
                        ExceptionMessages.InvalidTicketType
                    );
                }
            }
        }

        if (adultTickets === 0 && (childTickets > 0 || infantTickets > 0)) {
            // Child and Infant tickets cannot be purchased without purchasing an Adult ticket
            throw new InvalidPurchaseException(
                ExceptionMessages.NotEnoughAdults
            );
        }

        if (
            infantTickets + childTickets + adultTickets >
            Constants.MaxNumberOfTickets
        ) {
            // Only a maximum of 20 tickets that can be purchased at a time
            throw new InvalidPurchaseException(
                ExceptionMessages.TooManyTickets
            );
        }

        if (infantTickets > adultTickets) {
            // Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
            throw new InvalidPurchaseException(
                ExceptionMessages.TooManyInfants
            );
        }

        const numberOfSeats = adultTickets + childTickets;

        this.#finalisePurchase(accountId, numberOfSeats, cost);
    }

    /**
     * Finalise the purchase
     * @param {Number} accountId
     * @param {Number} numberOfSeats
     * @param {Number} cost
     */
    #finalisePurchase(accountId, numberOfSeats, cost) {
        // The seat will always be reserved once a reservation request has been made
        this.#reserveSeat(accountId, numberOfSeats);
        // The payment will always go through once a payment request has been made
        this.#makePayment(accountId, cost);
        // Currently no concerns about releasing seats if payment fails
    }

    /**
     * Allocate and reserve seats
     * @param {Number} accountId
     * @param {Number} numberOfSeats
     * @throws {InvalidReservationException}
     */
    #reserveSeat(accountId, numberOfSeats) {
        if (numberOfSeats <= Constants.MinNumberOfSeats) {
            // throw exception when minimum number of seats is not reached
            throw new InvalidReservationException(
                ExceptionMessages.MinNumberOfSeats
            );
        }
        try {
            const seatReservationService = new SeatReservationService();
            seatReservationService.reserveSeat(accountId, numberOfSeats);
        } catch (ex) {
            console.error(ex);
            throw new InvalidReservationException(
                ExceptionMessages.SeatAllocationError
            );
        }
    }

    /**
     * Take the payment
     * @param {Number} accountId
     * @param {Number} cost
     * @throws {InvalidPaymentException}
     */
    #makePayment(accountId, cost) {
        if (cost <= 0) {
            // throw exception when cost is less than or equal to 0
            throw new InvalidPaymentException(
                ExceptionMessages.MinNumberOfSeats
            );
        }
        try {
            const ticketPaymentService = new TicketPaymentService();
            ticketPaymentService.makePayment(accountId, cost);
        } catch (ex) {
            console.error(ex);
            throw new InvalidPaymentException(ExceptionMessages.PaymentError);
        }
    }
}

/*
  TODO
  - Make TicketTypeRequest Immutable
  - TicketType
    - type (Infant, Child, Adult)
    - cost (0, 10, 20)
    - hasSeat (false, true, true)
  - maximum number of purchasable tickets is 20
  - calculate correct number of seats and make request
  - calculate correct ammount for tickets and make request
  - reject invalid requests
    - more than 20 tickets
    - number of infants is greater than adults
    - account id greater than 0
    - funds??
    - valid ticket type
    - valid cost of each ticket
  -- validation surrounding payment and seat, payment first or seat first?
  -- concurrency
  
*/
