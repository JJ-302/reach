export const LOAD_START = 'LOAD_START';
export const LOAD_END = 'LOAD_END';

export const loadStart = () => ({
  type: LOAD_START,
});

export const loadEnd = () => ({
  type: LOAD_END,
});
