const INITIAL_STATE = {
  test: "can U hear mee",
  keywords: [],
  winners: [],
  reserveWinners: [],
  showModal: false,
  userCondition:false,
  commentCondition:false,
  videoID:"",
  winnerAmount:"",
  reserveWinnerAmount:"",
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_WINNERS":
      return { ...state, winners: [...action.payload] };
    case "GET_RESERVE_WINNERS":
      return { ...state, reserveWinners: [...action.payload] };
    case "TOGGLE_MODAL":
      return { ...state, showModal: !state.showModal };
    case "TOGGLE_USER_CONDITION":
      return { ...state, userCondition: !state.userCondition };
    case "TOGGLE_COMMENT_CONDITION":
      return { ...state, commentCondition: !state.commentCondition };
    case "GET_KEYWORDS":
      return { ...state, keywords: action.payload };
    case "GET_VIDEO_ID":
      return { ...state, videoID: action.payload };
    case "GET_WINNER_AMOUNT":
      return { ...state, winnerAmount: action.payload };
    case "GET_RESERVE_WINNER_AMOUNT":
      return { ...state, reserveWinnerAmount: action.payload };
    default:
      return state;
  }
};
