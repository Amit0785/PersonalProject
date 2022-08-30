const initialState = {
  numOfCakes: 10,
};

const IceCreamReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_ICECREAM:
      return {
        ...state,
        numOfCakes: state.numOfCakes - 1,
      };

    case ADD_ICECREAM:
      return {
        ...state,
        numOfCakes: state.numOfCakes + 1,
      };

    default:
      return state;
  }
};

export default IceCreamReducer;
