export const OPEN_TASK_FORM = 'OPEN_TASK_FORM';
export const CLOSE_TASK_FORM = 'CLOSE_TASK_FORM';

export const openTaskForm = (id = null) => ({
  type: OPEN_TASK_FORM,
  id,
});

export const closeTaskForm = () => ({
  type: CLOSE_TASK_FORM,
});
