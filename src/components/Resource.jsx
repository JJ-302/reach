import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as resourceActions from '../store/resource/actions';
import * as confirmActions from '../store/confirm/actions';
import ResourceForm from './ResourceForm';

const mapStateToProps = (state) => {
  const { resourceForm, resource } = state;
  return {
    resourceFormVisible: resourceForm.visible,
    resources: resource.resources,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openResourceForm, getAllResources, closeResourceForm } = resourceActions;
  const { closeConfirm } = confirmActions;
  return {
    getAllResources: () => dispatch(getAllResources()),
    openResourceForm: (id) => dispatch(openResourceForm(id)),
    closeResourceForm: () => dispatch(closeResourceForm()),
    closeConfirm: () => dispatch(closeConfirm()),
  };
};

const Resource = (props) => {
  const {
    resources,
    getAllResources,
    openResourceForm,
    resourceFormVisible,
  } = props;

  useEffect(() => {
    getAllResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = (event) => {
    const { id } = event.currentTarget.dataset;
    openResourceForm(id);
  };

  return (
    <div className="resource">
      {resources.map((resource) => (
        <div className="resource__wrapper" key={resource.id} onClick={onClick} data-id={resource.id}>
          <div className="resource__icon" style={{ backgroundColor: resource.color }} />
          <div className="resource__name">{resource.name}</div>
        </div>
      ))}
      {resourceFormVisible && <ResourceForm />}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Resource);
