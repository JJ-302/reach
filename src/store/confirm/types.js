import { serverError, reload } from '../../utils/Text';

export const INTERNAL_SERVER_ERROR = { type: 'error', title: serverError, description: reload };

export const AUTHORIZATION_FAILED = { type: 'error', title: serverError, description: reload };
