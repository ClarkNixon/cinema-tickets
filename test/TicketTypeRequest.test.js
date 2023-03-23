import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import Constants from "../src/pairtest/lib/Constants";

describe("TicketTypeRequest", () => {
    describe("when initialised with unknown type", () => {
        it("should throw expected type error", (done) => {
            const ticketTypes = Object.keys(Constants.TicketType);
            const initialisation = () => new TicketTypeRequest("UNKNOWN", 1);
            const errorText = `type must be ${ticketTypes
                .slice(0, -1)
                .join(", ")}, or ${ticketTypes.slice(-1)}`;
            expect(initialisation).toThrow(new TypeError(errorText));
            done();
        });
    });

    describe("when numberOfTickets is of the wrong type", () => {
        it("should throw expected type error", (done) => {
            const initialisation = () =>
                new TicketTypeRequest(Constants.TicketType.ADULT, "one");
            expect(initialisation).toThrow(
                new TypeError(
                    Constants.ExceptionMessages.InvalidNumberOfTickets
                )
            );
            done();
        });
    });

    describe("when numberOfTickets exceeds allowed number", () => {
        it("should throw expected type error", (done) => {
            const initialisation = () =>
                new TicketTypeRequest(
                    Constants.TicketType.ADULT,
                    Constants.MaxNumberOfTickets + 1
                );
            expect(initialisation).toThrow(
                new TypeError(Constants.ExceptionMessages.TooManyTickets)
            );
            done();
        });
    });

    describe("when initialised with a known type", () => {
        describe("when type is 'ADULT'", () => {
            it("should initialize and set expected values", (done) => {
                const numberOfTickets = 10;
                const ticketCost = 20;
                const ticketTypeName = Constants.TicketType.ADULT;
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
                const ticketCost = 10;
                const ticketTypeName = Constants.TicketType.CHILD;
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
                const ticketCost = 0;
                const ticketTypeName = Constants.TicketType.INFANT;
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
