import {
  OPEN_ACCOUNT_FORM,
  CLOSE_ACCOUNT_FORM,
} from './actions';

const initialAccountFormState = { visible: false };

export const accountFormReducer = (state = initialAccountFormState, action) => {
  switch (action.type) {
    case OPEN_ACCOUNT_FORM:
      return { visible: true };
    case CLOSE_ACCOUNT_FORM:
      return { visible: false };
    default:
      return state;
  }
};

export const accountReducer = () => {};
