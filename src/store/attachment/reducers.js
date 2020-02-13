import {
  OPEN_ATTACHMENT_FORM,
  CLOSE_ATTACHMENT_FORM,
  GET_ALL_ATTACHMENT,
  CREATE_ATTACHMENT,
  DELETE_ATTACHMENT,
  INVALID_ATTACHMENT_PARAMS,
} from './actions';

const initialAttachmentFormReducer = { visible: false, projectID: null, errors: [] };
const initialAttachmentReducer = { attachments: [] };

export const attachmentFormReducer = (state = initialAttachmentFormReducer, action) => {
  switch (action.type) {
    case OPEN_ATTACHMENT_FORM:
      return { visible: true, projectID: action.projectID, errors: [] };
    case CLOSE_ATTACHMENT_FORM:
      return { visible: false, projectID: null, errors: [] };
    case INVALID_ATTACHMENT_PARAMS:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export const attachmentReducer = (state = initialAttachmentReducer, action) => {
  switch (action.type) {
    case GET_ALL_ATTACHMENT:
      return { attachments: action.attachments };
    case CREATE_ATTACHMENT:
      return {
        ...state,
        attachments: [...state.attachments, action.attachment],
      };
    case DELETE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter((attachment) => String(attachment.id) !== action.id),
      };
    default:
      return state;
  }
};
