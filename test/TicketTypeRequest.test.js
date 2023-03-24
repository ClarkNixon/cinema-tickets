import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import Constants from "../src/pairtest/lib/constants/Constants";
import ExceptionMessages from "../src/pairtest/lib/constants/ExceptionMessages";

describe("TicketTypeRequest", () => {
    describe("when initialised with unknown type", () => {
        it("should throw expected type error", (done) => {
            const initialisation = () => new TicketTypeRequest("UNKNOWN", 1);
            expect(initialisation).toThrow(
                new TypeError(ExceptionMessages.TicketType)
            );
            done();
        });
    });

    describe("when numberOfTickets is of the wrong type", () => {
        it("should throw expected type error", (done) => {
            const initialisation = () =>
                new TicketTypeRequest(Constants.TicketType.Adult.Name, "one");
            expect(initialisation).toThrow(
                new TypeError(ExceptionMessages.InvalidNumberOfTickets)
            );
            done();
        });
    });

    describe("when numberOfTickets exceeds allowed number", () => {
        it("should throw expected type error", (done) => {
            const initialisation = () =>
                new TicketTypeRequest(
                    Constants.TicketType.Adult.Name,
                    Constants.MaxNumberOfTickets + 1
                );
            expect(initialisation).toThrow(
                new TypeError(ExceptionMessages.TooManyTickets)
            );
            done();
        });
    });

    describe("when initialised with a known type", () => {
        describe("when type is 'ADULT'", () => {
            it("should initialize and set expected values", (done) => {
                const numberOfTickets = 10;
                const ticketCost = Constants.TicketType.Adult.Cost;
                const ticketTypeName = Constants.TicketType.Adult.Name;
                const ticketRequest = new TicketTypeRequest(
                    ticketTypeName,
                    numberOfTickets
                );
                expect(ticketRequest.getNoOfTickets()).toBe(numberOfTickets);
                expect(ticketRequest.getTicketTypeName()).toBe(ticketTypeName);

                const ticket = ticketRequest.getTicketType();

                expect(ticket.getCost()).toBe(ticketCost);
                expect(ticket.getHasSeat()).toBeTruthy();
                expect(ticket.getTicketType()).toBe(ticketTypeName);
                done();
            });
        });
        describe("when type is 'CHILD'", () => {
            it("should initialize and set expected values", (done) => {
                const numberOfTickets = 10;
                const ticketCost = Constants.TicketType.Child.Cost;
                const ticketTypeName = Constants.TicketType.Child.Name;
                const ticketRequest = new TicketTypeRequest(
                    ticketTypeName,
                    numberOfTickets
                );
                expect(ticketRequest.getNoOfTickets()).toBe(numberOfTickets);
                expect(ticketRequest.getTicketTypeName()).toBe(ticketTypeName);

                const ticket = ticketRequest.getTicketType();

                expect(ticket.getCost()).toBe(ticketCost);
                expect(ticket.getHasSeat()).toBeTruthy();
                expect(ticket.getTicketType()).toBe(ticketTypeName);
                done();
            });
        });
        describe("when type is 'INFANT'", () => {
            it("should initialize and set expected values", (done) => {
                const numberOfTickets = 10;
                const ticketCost = Constants.TicketType.Infant.Cost;
                const ticketTypeName = Constants.TicketType.Infant.Name;
                const ticketRequest = new TicketTypeRequest(
                    ticketTypeName,
                    numberOfTickets
                );
                expect(ticketRequest.getNoOfTickets()).toBe(numberOfTickets);
                expect(ticketRequest.getTicketTypeName()).toBe(ticketTypeName);

                const ticket = ticketRequest.getTicketType();

                expect(ticket.getCost()).toBe(ticketCost);
                expect(ticket.getHasSeat()).toBeFalsy();
                expect(ticket.getTicketType()).toBe(ticketTypeName);
                done();
            });
        });
    });
});
