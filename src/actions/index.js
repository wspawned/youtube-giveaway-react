export const getWinners = winners => {
    return { type:"GET_WINNERS", payload:winners };
};

export const getReserveWinners = reserveWinners => {
    return { type:"GET_RESERVE_WINNERS", payload:reserveWinners }
}

export const toggleModal = () => {
    return { type:"TOGGLE_MODAL",}
}