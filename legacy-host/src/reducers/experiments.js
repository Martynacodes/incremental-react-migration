import { fakeApi } from "../fakeApi";

export const EXPERIMENTS_LOADING = "EXPERIMENTS_LOADING";
export const EXPERIMENTS_FETCHED = "EXPERIMENTS_FETCHED";

const initialState = { items: [], loading: false };

export const experimentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPERIMENTS_LOADING:
      return { ...state, loading: true };
    case EXPERIMENTS_FETCHED:
      return { items: action.data, loading: false };
    default:
      return state;
  }
};

// Classic thunk: loading -> fetch -> success.
export const fetchExperiments = () => async (dispatch) => {
  dispatch({ type: EXPERIMENTS_LOADING });
  const response = await fakeApi("GET", "/experiments");

  dispatch({ type: EXPERIMENTS_FETCHED, data: response.data });
};
