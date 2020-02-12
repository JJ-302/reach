import Moment from 'moment';

export const START_DAY = Moment(new Date()).subtract(2, 'weeks').startOf('days');

export const END_DAY = Moment(new Date()).add(1, 'years');

export const SUN = 0;
export const MON = 1;
export const TUE = 2;
export const WED = 3;
export const THU = 4;
export const FRI = 5;
export const SAT = 6;
