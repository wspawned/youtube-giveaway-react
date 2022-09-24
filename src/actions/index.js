export const getWinners = winners => {
    return { type:"GET_WINNERS", payload:winners };
};

export const getReserveWinners = reserveWinners => {
    return { type:"GET_RESERVE_WINNERS", payload:reserveWinners }
}

export const toggleModal = () => {
    return { type:"TOGGLE_MODAL",}
}

export const toggleUserCondition = () => {
    return { type:"TOGGLE_USER_CONDITION",}
}

export const toggleCommentCondition = () => {
    return { type:"TOGGLE_COMMENT_CONDITION",}
}

export const getKeywords = (keywords) => {
    return { type:"GET_KEYWORDS", payload:keywords }
}

export const getVideoID = (id) => {
    return { type:"GET_VIDEO_ID", payload:id }
}

export const getWinnerAmount = (amount) => {
    return { type:"GET_WINNER_AMOUNT", payload:amount }
}
export const getReserveWinnerAmount = (amount) => {
    return { type:"GET_RESERVE_WINNER_AMOUNT", payload:amount }
}