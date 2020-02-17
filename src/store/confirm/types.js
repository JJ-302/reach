import { serverError, reload } from '../../utils/Text';

export const INTERNAL_SERVER_ERROR = { type: 'error', title: serverError, description: reload };

export const SENT_MESSAGE = { type: 'success', title: 'Completed', description: 'SlackBot sent a Message' };
