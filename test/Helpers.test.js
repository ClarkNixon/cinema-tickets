import Constants from "../src/pairtest/lib/constants/Constants";
import Helpers from "../src/pairtest/lib/helpers/Helpers";

describe("Helpers", () => {
    describe("TicketNameHelper", () => {
        it("should provide a list of ticket type names", (done) => {
            const listOfNames = Helpers.TicketNameHelper();
            expect(listOfNames[0]).toBe(Constants.TicketType.Adult.Name);
            expect(listOfNames[1]).toBe(Constants.TicketType.Child.Name);
            expect(listOfNames[2]).toBe(Constants.TicketType.Infant.Name);
            done();
        });
    });
});
