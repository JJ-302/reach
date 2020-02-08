export const OPEN_RESOURCE_FORM = 'OPEN_RESOURCE_FORM';
export const CLOSE_RESOURCE_FORM = 'CLOSE_RESOURCE_FORM';

export const openResourceForm = (id = null) => ({
  type: OPEN_RESOURCE_FORM,
  id,
});

export const closeResourceForm = () => ({
  type: CLOSE_RESOURCE_FORM,
});
