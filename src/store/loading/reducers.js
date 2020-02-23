import { LOAD_START, LOAD_END } from './actions';

const initialLoadingState = { isLoading: false };

const loadingReducer = (state = initialLoadingState, action) => {
  switch (action.type) {
    case LOAD_START:
      return {
        isLoading: true,
      };
    case LOAD_END:
      return {
        isLoading: false,
      };
    default:
      return state;
  }
};
export default loadingReducer;
