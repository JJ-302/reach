import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as projectActions from '../store/project/actions';
import * as resourceActions from '../store/resource/actions';
import Confirm from './Confirm';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import {
  badRequest,
  checkParams,
  reload,
  serverError,
  ask,
  destroy,
} from '../utils/Text';

const mapStateToProps = (state) => {
  const { resourceForm } = state;
  return {
    resourceID: resourceForm.id,
  };
};


const mapDispatchToProps = (dispatch) => {
  const { getAllProjects } = projectActions;
  const {
    closeResourceForm, createResource, deleteResource, updateResource,
  } = resourceActions;

  return {
    getAllProjects: () => dispatch(getAllProjects()),
    closeResourceForm: () => dispatch(closeResourceForm()),
    createResource: (params) => dispatch(createResource(params)),
    deleteResource: (resourceID) => dispatch(deleteResource(resourceID)),
    updateResource: (resourceID, params) => dispatch(updateResource(resourceID, params)),
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
      errors: [],
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  async componentDidMount() {
    this.token = await localStorage.getItem('token');
    this.getIndexColors();
    if (this.action === 'edit') {
      this.editResourceFormValue();
    }
  }

  getIndexColors = async () => {
    const url = Utils.buildRequestUrl('/colors');
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
    });

    const { is_authenticated, colors } = await response.json();
    if (is_authenticated) {
      this.setState({ colors });
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm);
    }
  }

  editResourceFormValue = async () => {
    const { resourceID } = this.props;
    const url = Utils.buildRequestUrl(`/resources/${resourceID}/edit`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
    });

    const { is_authenticated, resource } = await response.json();
    if (is_authenticated) {
      this.setState({ name: resource.name, pickedColor: String(resource.color_id) });
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm);
    }
  }

  handleCreate = () => {
    const { createResource } = this.props;
    const { pickedColor, name } = this.state;
    const params = { name, color_id: pickedColor };
    createResource(params);
  }

  handleDestroy = () => {
    const { resourceID, deleteResource } = this.props;
    this.openConfirm('ask', `Project ${destroy}`, ask, () => deleteResource(resourceID));
  }

  handleUpdate = async () => {
    const { resourceID, updateResource, getAllProjects } = this.props;
    const { pickedColor, name } = this.state;
    const params = { name, color_id: pickedColor };
    await updateResource(resourceID, params);
    getAllProjects();
  }

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    });
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

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
    const { closeResourceForm } = this.props;
    const {
      name,
      colors,
      pickedColor,
      errors,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

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
        {confirmVisible && (
          <Confirm
            type={confirmType}
            closeConfirm={this.closeConfirm}
            title={confirmTitle}
            description={confirmDescription}
            confirm={confirm}
          />
        )}
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
