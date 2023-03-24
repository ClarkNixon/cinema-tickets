import Constants from "../constants/Constants";

const TicketNameHelper = () =>
    Object.entries(Constants.TicketType)
        .map((x) => x[1].Name)
        .reverse();

export default { TicketNameHelper };
