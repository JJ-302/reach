import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../store/resource/actions';
import ResourceForm from './ResourceForm';

const mapStateToProps = (state) => {
  const { resourceForm, resource } = state;
  return {
    resourceFormVisible: resourceForm.visible,
    resources: resource.resources,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openResourceForm, getAllResources, closeResourceForm } = actions;
  return {
    getAllResources: () => dispatch(getAllResources()),
    openResourceForm: (id) => dispatch(openResourceForm(id)),
    closeResourceForm: () => dispatch(closeResourceForm()),
  };
};

class Resource extends Component {
  componentDidMount() {
    const { getAllResources } = this.props;
    getAllResources();
  }

  componentDidUpdate(previousProps) {
    const { resources, closeResourceForm } = this.props;
    if (previousProps.resources.length !== resources.length) {
      closeResourceForm();
    }
  }

  onClick = (event) => {
    const { openResourceForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openResourceForm(id);
  };

  render() {
    const { resources, resourceFormVisible } = this.props;

    return (
      <div className="resource">
        {resources.map((resource) => (
          <div className="resource__wrapper" key={resource.id} onClick={this.onClick} data-id={resource.id}>
            <div className="resource__icon" style={{ backgroundColor: resource.color }} />
            <div className="resource__name">{resource.name}</div>
          </div>
        ))}
        {resourceFormVisible && <ResourceForm />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resource);
