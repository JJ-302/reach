import { WEEKS, DAYS } from './types';

export const CHANGE_TO_WEEKS = 'CHANGE_TO_WEEKS';
export const CHANGE_TO_DAYS = 'CHANGE_TO_DAYS';

export const changeToWeeks = () => ({
  type: CHANGE_TO_WEEKS,
  scheduleType: WEEKS,
});

export const changeToDays = () => ({
  type: CHANGE_TO_DAYS,
  scheduleType: DAYS,
});
