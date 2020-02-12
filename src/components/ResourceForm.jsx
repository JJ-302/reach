import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as projectActions from '../store/project/actions';
import * as resourceActions from '../store/resource/actions';
import * as confirmActions from '../store/confirm/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import {
  reload, serverError, ask, destroy,
} from '../utils/Text';

const mapStateToProps = (state) => {
  const { resourceForm } = state;
  return {
    resourceID: resourceForm.id,
    errors: resourceForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { getAllProjects } = projectActions;
  const { openConfirm } = confirmActions;
  const {
    closeResourceForm, createResource, deleteResource, updateResource,
  } = resourceActions;

  return {
    getAllProjects: () => dispatch(getAllProjects()),
    closeResourceForm: () => dispatch(closeResourceForm()),
    createResource: (params) => dispatch(createResource(params)),
    deleteResource: (resourceID) => dispatch(deleteResource(resourceID)),
    updateResource: (resourceID, params) => dispatch(updateResource(resourceID, params)),
    openConfirm: (payload) => dispatch(openConfirm(payload)),
  };
};

class ResourceForm extends PureComponent {
  constructor(props) {
    super(props);
    const { resourceID } = this.props;
    this.action = resourceID ? 'edit' : 'new';
    this.submit = resourceID ? this.handleUpdate : this.handleCreate;
    this.state = {
      name: '',
      colors: [],
      pickedColor: '',
    };
  }

  componentDidMount() {
    this.token = localStorage.getItem('token');
    this.getIndexColors();
    if (this.action === 'edit') {
      this.editResourceFormValue();
    }
  }

  getIndexColors = async () => {
    const url = Utils.buildRequestUrl('/colors');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': this.token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      const confirmConfig = { type: 'error', title: serverError, description: reload };
      const { openConfirm } = this.props;
      openConfirm(confirmConfig);
      return;
    }
    const { colors } = response.data;
    this.setState({ colors });
  }

  editResourceFormValue = async () => {
    const { resourceID } = this.props;
    const url = Utils.buildRequestUrl(`/resources/${resourceID}/edit`);
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': this.token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      const confirmConfig = { type: 'error', title: serverError, description: reload };
      const { openConfirm } = this.props;
      openConfirm(confirmConfig);
      return;
    }
    const { resource } = response.data;
    this.setState({ name: resource.name, pickedColor: String(resource.color_id) });
  }

  handleCreate = () => {
    const { createResource } = this.props;
    const { pickedColor, name } = this.state;
    const params = { name, color_id: pickedColor };
    createResource(params);
  }

  handleDestroy = () => {
    const { deleteResource, resourceID, openConfirm } = this.props;
    const confirmConfig = {
      type: 'ask',
      title: `Resource ${destroy}`,
      description: ask,
      confirm: () => deleteResource(resourceID),
    };
    openConfirm(confirmConfig);
  }

  handleUpdate = async () => {
    const { resourceID, updateResource, getAllProjects } = this.props;
    const { pickedColor, name } = this.state;
    const params = { name, color_id: pickedColor };
    await updateResource(resourceID, params);
    getAllProjects();
  }

  onPickColor = (event) => {
    const pickedColor = event.target.dataset.color;
    this.setState({ pickedColor });
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const title = this.action === 'new' ? 'Create Resource' : 'Update Resource';
    const { closeResourceForm, errors } = this.props;
    const { name, colors, pickedColor } = this.state;

    return (
      <div className="modalOverlay" onClick={closeResourceForm}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">{title}</div>
          {errors.length !== 0 && <ErrorMessage action="Resource creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="リソース名を入力"
            value={name}
            onChange={this.onChangeName}
          />
          <div className="modalForm__label">ラベルの色を選択</div>
          <div className="colorPallet">
            <ColorPallets
              colors={colors}
              pickedColor={pickedColor}
              onPickColor={this.onPickColor}
            />
          </div>
          <button type="button" onClick={this.submit} className="modalForm__button">
            {title}
          </button>
          {this.action === 'edit' && (
            <button type="button" onClick={this.handleDestroy} className="modalForm__button--delete">
              Delete Resource
            </button>
          )}
        </div>
      </div>
    );
  }
}

const ColorPallets = ({ colors, pickedColor, onPickColor }) => (
  colors.map((color) => {
    const modifier = pickedColor === String(color.id) ? '--selected' : '';
    const className = `colorPallet__body${modifier}`;
    return (
      <div key={color.id} className="colorPallet__edge">
        <div
          className={className}
          style={{ backgroundColor: color.value }}
          data-color={color.id}
          onClick={onPickColor}
        />
      </div>
    );
  })
);

export default connect(mapStateToProps, mapDispatchToProps)(ResourceForm);
