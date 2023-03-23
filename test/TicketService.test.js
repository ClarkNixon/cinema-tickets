import TicketService from "../src/pairtest/TicketService";
import InvalidPurchaseException from "../src/pairtest/lib/exceptions/InvalidPurchaseException";
import Constants from "../src/pairtest/lib/Constants";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";
import AdultTicketType from "../src/pairtest/lib/tickettypes/AdultTicketType";
import ChildTicketType from "../src/pairtest/lib/tickettypes/ChildTicketType";

jest.mock("../src/thirdparty/seatbooking/SeatReservationService");
jest.mock("../src/thirdparty/paymentgateway/TicketPaymentService");

describe("TicketService", () => {
    let ticketService;
    const accountId = 1;

    beforeEach(() => {
        ticketService = new TicketService();
    });

    describe("when called with account ID that is not an number", () => {
        it("should throw type Error", (done) => {
            const incorrectAccountId = "one";
            const request = [];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(incorrectAccountId, request);
            expect(ticketPurchase).toThrow(
                new TypeError(Constants.ExceptionMessages.InvalidAccountIdType)
            );
            done();
        });
    });

    describe("when called with account ID less than zero", () => {
        it("should throw purchase exception", (done) => {
            const incorrectAccountId = -1;
            const request = [];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(incorrectAccountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.InvalidAccountId
                )
            );
            done();
        });
    });

    describe("when called with no ticket type request", () => {
        it("should throw purchase exception", (done) => {
            const request = [];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.InvalidTicketTypeRequest
                )
            );
            done();
        });
    });

    describe("when more tickets are requested than allowed", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.ADULT, 19),
                new TicketTypeRequest(Constants.TicketType.CHILD, 2),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.TooManyTickets
                )
            );
            done();
        });
    });

    describe("when 'CHILD' tickets are requested without an 'ADULT'", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.CHILD, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.NotEnoughAdults
                )
            );
            done();
        });
    });

    describe("when 'INFANT' tickets are requested without an 'ADULT'", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.INFANT, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.NotEnoughAdults
                )
            );
            done();
        });
    });

    describe("when more 'INFANT' tickets are requested than 'ADULTS'", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.ADULT, 2),
                new TicketTypeRequest(Constants.TicketType.INFANT, 3),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.TooManyInfants
                )
            );
            done();
        });
    });

    describe("when exception is thrown in 'SeatReservationService'", () => {
        const mockErrorText = "Mock error";

        beforeEach(() => {
            // eslint-disable-next-line arrow-body-style
            SeatReservationService.mockImplementationOnce(() => {
                return {
                    reserveSeat: () => {
                        throw new Error(mockErrorText);
                    },
                };
            });
        });

        afterEach(() => {
            SeatReservationService.mockClear();
        });

        it("should catch exception thrown from 'SeatReservationService' and log error", (done) => {
            const consoleSpy = jest
                .spyOn(global.console, "error")
                .mockImplementation();
            const request = [
                new TicketTypeRequest(Constants.TicketType.ADULT, 2),
                new TicketTypeRequest(Constants.TicketType.INFANT, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.SeatAllocationError
                )
            );
            expect(consoleSpy).toHaveBeenCalledWith(new Error(mockErrorText));
            done();
        });
    });

    describe("when exception is thrown in 'TicketPaymentService'", () => {
        const mockErrorText = "Mock error";
        beforeEach(() => {
            // eslint-disable-next-line arrow-body-style
            TicketPaymentService.mockImplementationOnce(() => {
                return {
                    makePayment: () => {
                        throw new Error(mockErrorText);
                    },
                };
            });
        });

        afterEach(() => {
            TicketPaymentService.mockClear();
        });

        it("should catch exception thrown from 'TicketPaymentService' and log error", (done) => {
            const consoleSpy = jest
                .spyOn(global.console, "error")
                .mockImplementation();
            const request = [
                new TicketTypeRequest(Constants.TicketType.ADULT, 2),
                new TicketTypeRequest(Constants.TicketType.INFANT, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    Constants.ExceptionMessages.PaymentError
                )
            );
            expect(consoleSpy).toHaveBeenCalledWith(new Error(mockErrorText));
            done();
        });
    });

    describe("when the maximum number of 'ADULT' tickets is requested", () => {
        const mockSeatReservationFunction = jest.fn();
        const mockPaymentFunction = jest.fn();
        beforeEach(() => {
            // eslint-disable-next-line arrow-body-style
            TicketPaymentService.mockImplementationOnce(() => {
                return {
                    makePayment: mockPaymentFunction,
                };
            });
            // eslint-disable-next-line arrow-body-style
            SeatReservationService.mockImplementationOnce(() => {
                return {
                    reserveSeat: mockSeatReservationFunction,
                };
            });
        });

        afterEach(() => {
            TicketPaymentService.mockClear();
            SeatReservationService.mockClear();
        });

        it("should call the 'SeatReservationService' and 'TicketPaymentService' correct number of time with correct data", (done) => {
            const maxNumberOfSeats = Constants.MaxNumberOfTickets;
            const adultTicketCost = new AdultTicketType().getCost();
            const costOfTickets = adultTicketCost * maxNumberOfSeats;
            const request = [
                new TicketTypeRequest(
                    Constants.TicketType.ADULT,
                    maxNumberOfSeats
                ),
            ];
            ticketService.purchaseTickets(accountId, request);
            expect(mockSeatReservationFunction).toHaveBeenCalledTimes(1);
            expect(mockSeatReservationFunction).toHaveBeenCalledWith(
                accountId,
                maxNumberOfSeats
            );
            expect(mockPaymentFunction).toHaveBeenCalledTimes(1);
            expect(mockPaymentFunction).toHaveBeenCalledWith(
                accountId,
                costOfTickets
            );
            done();
        });
    });

    describe("when the maximum number of 'CHILD' tickets is requested", () => {
        const mockSeatReservationFunction = jest.fn();
        const mockPaymentFunction = jest.fn();
        beforeEach(() => {
            // eslint-disable-next-line arrow-body-style
            TicketPaymentService.mockImplementationOnce(() => {
                return {
                    makePayment: mockPaymentFunction,
                };
            });
            // eslint-disable-next-line arrow-body-style
            SeatReservationService.mockImplementationOnce(() => {
                return {
                    reserveSeat: mockSeatReservationFunction,
                };
            });
        });

        afterEach(() => {
            TicketPaymentService.mockClear();
            SeatReservationService.mockClear();
        });

        it("should call the 'SeatReservationService' and 'TicketPaymentService' correct number of time with correct data", (done) => {
            const maxNumberOfSeats = Constants.MaxNumberOfTickets;
            const adultTicketCost = new AdultTicketType().getCost();
            const childTicketCost = new ChildTicketType().getCost();
            const costOfTickets =
                adultTicketCost * 1 + childTicketCost * (maxNumberOfSeats - 1);
            const request = [
                new TicketTypeRequest(Constants.TicketType.ADULT, 1),
                new TicketTypeRequest(
                    Constants.TicketType.CHILD,
                    maxNumberOfSeats - 1
                ),
            ];
            ticketService.purchaseTickets(accountId, request);
            expect(mockSeatReservationFunction).toHaveBeenCalledTimes(1);
            expect(mockSeatReservationFunction).toHaveBeenCalledWith(
                accountId,
                maxNumberOfSeats
            );
            expect(mockPaymentFunction).toHaveBeenCalledTimes(1);
            expect(mockPaymentFunction).toHaveBeenCalledWith(
                accountId,
                costOfTickets
            );
            done();
        });
    });
});
