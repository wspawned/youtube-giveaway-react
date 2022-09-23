export const getWinners = winners => {
    return { type:"GET_WINNERS", payload:winners };
};

export const toggleModal = () => {
    return { type:"TOGGLE_MODAL",}
}