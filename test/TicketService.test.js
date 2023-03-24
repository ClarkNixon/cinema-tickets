import TicketService from "../src/pairtest/TicketService";
import InvalidPurchaseException from "../src/pairtest/lib/exceptions/InvalidPurchaseException";
import Constants from "../src/pairtest/lib/constants/Constants";
import ExceptionMessages from "../src/pairtest/lib/constants/ExceptionMessages";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";

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
                new TypeError(ExceptionMessages.InvalidAccountIdType)
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
                new InvalidPurchaseException(ExceptionMessages.InvalidAccountId)
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
                    ExceptionMessages.InvalidTicketTypeRequest
                )
            );
            done();
        });
    });

    describe("when more tickets are requested than allowed", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.Adult.Name, 19),
                new TicketTypeRequest(Constants.TicketType.Child.Name, 2),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(ExceptionMessages.TooManyTickets)
            );
            done();
        });
    });

    describe("when 'CHILD' tickets are requested without an 'ADULT'", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.Child.Name, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(ExceptionMessages.NotEnoughAdults)
            );
            done();
        });
    });

    describe("when 'INFANT' tickets are requested without an 'ADULT'", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.Infant.Name, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(ExceptionMessages.NotEnoughAdults)
            );
            done();
        });
    });

    describe("when more 'INFANT' tickets are requested than 'ADULTS'", () => {
        it("should throw purchase exception", (done) => {
            const request = [
                new TicketTypeRequest(Constants.TicketType.Adult.Name, 2),
                new TicketTypeRequest(Constants.TicketType.Infant.Name, 3),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(ExceptionMessages.TooManyInfants)
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
                new TicketTypeRequest(Constants.TicketType.Adult.Name, 2),
                new TicketTypeRequest(Constants.TicketType.Infant.Name, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(
                    ExceptionMessages.SeatAllocationError
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
                new TicketTypeRequest(Constants.TicketType.Adult.Name, 2),
                new TicketTypeRequest(Constants.TicketType.Infant.Name, 1),
            ];
            const ticketPurchase = () =>
                ticketService.purchaseTickets(accountId, request);
            expect(ticketPurchase).toThrow(
                new InvalidPurchaseException(ExceptionMessages.PaymentError)
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
            const costOfTickets = 400;
            const request = [
                new TicketTypeRequest(
                    Constants.TicketType.Adult.Name,
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
            const costOfTickets = 210;
            const request = [
                new TicketTypeRequest(Constants.TicketType.Adult.Name, 1),
                new TicketTypeRequest(
                    Constants.TicketType.Child.Name,
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
