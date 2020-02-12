import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as projectActions from '../store/project/actions';
import * as confirmActions from '../store/confirm/actions';
import Utils from '../utils/Utils';
import ErrorMessage from './Error';
import {
  reload, serverError, ask, destroy,
} from '../utils/Text';

import '../css/Form.scss';

const mapStateToProps = (state) => {
  const { projectForm } = state;
  return {
    projectID: projectForm.id,
    errors: projectForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openConfirm } = confirmActions;
  const {
    closeProjectForm, createProject, deleteProject, updateProject,
  } = projectActions;

  return {
    closeProjectForm: () => dispatch(closeProjectForm()),
    createProject: (params) => dispatch(createProject(params)),
    deleteProject: (projectID) => dispatch(deleteProject(projectID)),
    updateProject: (projectID, params) => dispatch(updateProject(projectID, params)),
    openConfirm: (payload) => dispatch(openConfirm(payload)),
  };
};

class ProjectForm extends PureComponent {
  constructor(props) {
    super(props);
    const { projectID } = this.props;
    this.action = projectID ? 'edit' : 'new';
    this.submit = projectID ? this.handleUpdate : this.handleCreate;
    this.state = {
      name: '',
      description: '',
    };
  }

  componentDidMount() {
    if (this.action === 'edit') {
      this.editProjectFormValue();
    }
  }

  editProjectFormValue = async () => {
    const { projectID } = this.props;
    const url = Utils.buildRequestUrl(`/projects/${projectID}/edit`);
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      const confirmConfig = { type: 'error', title: serverError, description: reload };
      const { openConfirm } = this.props;
      openConfirm(confirmConfig);
      return;
    }
    const { name, description } = response.data.project;
    this.setState({ name, description });
  }

  handleCreate = () => {
    const { createProject } = this.props;
    const { name, description } = this.state;
    const params = { name, description };
    createProject(params);
  }

  handleDestroy = () => {
    const { deleteProject, projectID, openConfirm } = this.props;
    const confirmConfig = {
      type: 'ask',
      title: `Project ${destroy}`,
      description: ask,
      confirm: () => deleteProject(projectID),
    };
    openConfirm(confirmConfig);
  }

  handleUpdate = () => {
    const { updateProject, projectID } = this.props;
    const { name, description } = this.state;
    const params = { name, description };
    updateProject(projectID, params);
  }

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
    const { closeProjectForm, errors } = this.props;
    const { name, description } = this.state;

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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);
