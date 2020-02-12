import { CHANGE_TO_WEEKS, CHANGE_TO_DAYS } from './actions';
import { WEEKS, DAYS } from './types';

const initialScheduleState = { scheduleType: WEEKS };

const scheduleReducer = (state = initialScheduleState, action) => {
  switch (action.type) {
    case CHANGE_TO_WEEKS:
      return { scheduleType: WEEKS };
    case CHANGE_TO_DAYS:
      return { scheduleType: DAYS };
    default:
      return state;
  }
};

export default scheduleReducer;
