export const OPEN_CONFIRM = 'OPEN_CONFIRM';
export const CLOSE_CONFIRM = 'CLOSE_CONFIRM';

export const openConfirm = (payload) => ({
  type: OPEN_CONFIRM,
  payload,
});

export const closeConfirm = () => ({
  type: CLOSE_CONFIRM,
});
