import ExceptionMessages from "../src/pairtest/lib/constants/ExceptionMessages";
import BaseTicketType from "../src/pairtest/lib/tickettypes/BaseTicketType";

describe("BaseTicketType", () => {
    describe("when 'BaseTicketType' is initialised", () => {
        it("should throw expected type error", (done) => {
            const initialisation = () => new BaseTicketType();
            expect(initialisation).toThrow(
                new Error(ExceptionMessages.BaseTicketTypeError)
            );
            done();
        });
    });
});
