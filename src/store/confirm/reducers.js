import { OPEN_CONFIRM, CLOSE_CONFIRM } from './actions';

const initialConfirmState = {
  visible: false,
  type: '',
  title: '',
  description: '',
  confirm: () => {},
};

const confirmReducer = (state = initialConfirmState, action) => {
  switch (action.type) {
    case OPEN_CONFIRM:
      return {
        visible: true,
        type: action.payload.type,
        title: action.payload.title,
        description: action.payload.description,
        confirm: action.payload.confirm,
      };
    case CLOSE_CONFIRM:
      return initialConfirmState;
    default:
      return state;
  }
};

export default confirmReducer;
