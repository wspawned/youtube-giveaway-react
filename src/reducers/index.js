const INITIAL_STATE = {
    test:"can U hear mee",
    winners:[],
    showModal:false,
}

export const reducer = (state=INITIAL_STATE , action) => {
    switch(action.type) {
        case "GET_WINNERS":
            return { ...state, winners:[...action.payload]}
        case "TOGGLE_MODAL":
            return { ...state, showModal:!state.showModal }
        default:
            return state;
    }
}