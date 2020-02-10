import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from '../store/project/actions';
import Utils from '../utils/Utils';
import Confirm from './Confirm';
import ErrorMessage from './Error';
import {
  badRequest,
  checkParams,
  reload,
  serverError,
  ask,
  destroy,
} from '../utils/Text';

import '../css/Form.scss';

const mapDispatchToProps = (dispatch) => {
  const {
    closeProjectForm, createProject, deleteProject, updateProject,
  } = actions;

  return {
    closeProjectForm: () => dispatch(closeProjectForm()),
    createProject: (params) => dispatch(createProject(params)),
    deleteProject: (id) => dispatch(deleteProject(id)),
    updateProject: (id, params) => dispatch(updateProject(id, params)),
  };
};

class ProjectForm extends PureComponent {
  constructor(props) {
    super(props);
    this.token = localStorage.getItem('token');
    const { id } = this.props;
    this.action = id ? 'edit' : 'new';
    this.submit = id ? this.handleUpdate : this.handleCreate;
    this.state = {
      name: '',
      description: '',
      errors: [],
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  componentDidMount() {
    if (this.action === 'edit') {
      this.editProjectFormValue();
    }
  }

  editProjectFormValue = async () => {
    const { id } = this.props;
    const url = Utils.buildRequestUrl(`/projects/${id}/edit`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
    });

    const { is_authenticated, project } = await response.json();
    if (is_authenticated) {
      const { name, description } = project;
      this.setState({ name, description });
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm);
    }
  }

  handleCreate = () => {
    const { createProject } = this.props;
    const { name, description } = this.state;
    const params = { name, description };
    createProject(params);
  }

  handleDestroy = () => {
    const { deleteProject, id } = this.props;
    this.openConfirm('ask', `Project ${destroy}`, ask, () => deleteProject(id));
  }

  handleUpdate = () => {
    const { updateProject, id } = this.props;
    const { name, description } = this.state;
    const params = { name, description };
    updateProject(id, params);
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

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onChangeDescription = (event) => {
    const description = event.target.value;
    this.setState({ description });
  }

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const { closeProjectForm } = this.props;
    const {
      name,
      description,
      errors,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    const title = this.action === 'new' ? 'Create Project' : 'Update Project';
    return (
      <div className="modalOverlay" onClick={closeProjectForm}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">{title}</div>
          {errors.length !== 0 && <ErrorMessage action="Project creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="プロジェクト名を入力"
            value={name}
            onChange={this.onChangeName}
          />
          <textarea
            className="modalForm__textarea"
            placeholder="プロジェクトの説明を入力"
            value={description}
            onChange={this.onChangeDescription}
          />
          <button type="button" onClick={this.submit} className="modalForm__button">
            {title}
          </button>
          {this.action === 'edit' && (
            <button type="button" onClick={this.handleDestroy} className="modalForm__button--delete">
              Delete Project
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

export default connect(null, mapDispatchToProps)(ProjectForm);
