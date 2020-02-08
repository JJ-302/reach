import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../store/resource/actions';
import ResourceForm from './ResourceForm';

const mapStateToProps = (state) => {
  const { resourceForm, resource } = state;
  return {
    resourceFormVisible: resourceForm.visible,
    targetID: resourceForm.id,
    resources: resource.resources,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openResourceForm, getAllResources } = actions;
  return {
    getAllResources: () => dispatch(getAllResources()),
    openResourceForm: (id) => dispatch(openResourceForm(id)),
  };
};

class Resource extends Component {
  componentDidMount() {
    const { getAllResources } = this.props;
    getAllResources();
  }

  onClick = (event) => {
    const { openResourceForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openResourceForm(id);
  };

  render() {
    const {
      resources, refresh, resourceFormVisible, targetID,
    } = this.props;

    return (
      <div className="resource">
        {resources.map((resource) => (
          <div className="resource__wrapper" key={resource.id} onClick={this.onClick} data-id={resource.id}>
            <div className="resource__icon" style={{ backgroundColor: resource.color }} />
            <div className="resource__name">{resource.name}</div>
          </div>
        ))}
        {resourceFormVisible && <ResourceForm id={targetID} refresh={refresh} />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resource);
