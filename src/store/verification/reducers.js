import { OPEN_VERIFICATION_FORM, CLOSE_VERIFICATION_FORM } from './actions';

const initialVerificationFormState = { visible: false };

const verificationFormReducer = (state = initialVerificationFormState, action) => {
  switch (action.type) {
    case OPEN_VERIFICATION_FORM:
      return { visible: true };
    case CLOSE_VERIFICATION_FORM:
      return { visible: false };
    default:
      return state;
  }
};

export default verificationFormReducer;
