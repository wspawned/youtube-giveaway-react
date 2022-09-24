const INITIAL_STATE = {
  test: "can U hear mee",
  winners: [],
  reserveWinners: [],
  showModal: false,
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_WINNERS":
      return { ...state, winners: [...action.payload] };
    case "GET_RESERVE_WINNERS":
      return { ...state, reserveWinners: [...action.payload] };
    case "TOGGLE_MODAL":
      return { ...state, showModal: !state.showModal };
    default:
      return state;
  }
};
