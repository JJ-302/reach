import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../store/resource/actions';
import ResourceForm from './ResourceForm';

const mapStateToProps = (state) => {
  const { resourceForm } = state;
  return {
    resourceFormVisible: resourceForm.visible,
    targetID: resourceForm.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openResourceForm } = actions;
  return {
    openResourceForm: (id) => dispatch(openResourceForm(id)),
  };
};

const Resource = (props) => {
  const {
    resources, refresh, openResourceForm, resourceFormVisible, targetID,
  } = props;

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
      {resourceFormVisible && (
        <ResourceForm id={targetID} refresh={refresh} />)}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Resource);
