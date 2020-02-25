import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as projectActions from '../store/project/actions';
import * as confirmActions from '../store/confirm/actions';
import Utils from '../utils/Utils';
import ErrorMessage from './Error';
import { ask, destroy } from '../utils/Text';

import '../css/Form.scss';

const mapStateToProps = (state) => {
  const { projectForm } = state;
  return {
    projectID: projectForm.id,
    errors: projectForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openConfirm, closeConfirm } = confirmActions;
  const {
    closeProjectForm, createProject, deleteProject, updateProject,
  } = projectActions;

  return {
    closeProjectForm: () => dispatch(closeProjectForm()),
    createProject: (params) => dispatch(createProject(params)),
    deleteProject: (projectID) => dispatch(deleteProject(projectID)),
    updateProject: (projectID, params) => dispatch(updateProject(projectID, params)),
    openConfirm: (payload) => dispatch(openConfirm(payload)),
    closeConfirm: () => dispatch(closeConfirm()),
  };
};

const GET_PROJECT_VALUES = 'GET_PROJECT_VALUES';
const ON_CHANGE_NAME = 'ON_CHANGE_NAME';
const ON_CHANGE_DESCRIPTION = 'ON_CHANGE_DESCRIPTION';

const initialProjectLocalState = { name: '', description: '' };

const projectFormReducer = (state, action) => {
  switch (action.type) {
    case GET_PROJECT_VALUES:
      return {
        name: action.payload.name,
        description: action.payload.description,
      };
    case ON_CHANGE_NAME:
      return {
        ...state,
        name: action.value,
      };
    case ON_CHANGE_DESCRIPTION:
      return {
        ...state,
        description: action.value,
      };
    default:
      return state;
  }
};

const ProjectForm = (props) => {
  const {
    projectID,
    createProject,
    updateProject,
    deleteProject,
    closeProjectForm,
    openConfirm,
    closeConfirm,
    errors,
  } = props;

  const action = projectID ? 'edit' : 'new';
  const [state, dispatch] = useReducer(projectFormReducer, initialProjectLocalState);
  const { name, description } = state;

  useEffect(() => {
    if (action === 'edit') {
      editProjectFormValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editProjectFormValue = async () => {
    const url = Utils.buildRequestUrl(`/projects/${projectID}/edit`);
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }
    const { project } = response.data;
    const payload = { name: project.name, description: project.description };
    dispatch({ type: GET_PROJECT_VALUES, payload });
  };

  const handleCreate = () => {
    const params = { name, description };
    createProject(params);
  };

  const handleUpdate = () => {
    const params = { name, description };
    updateProject(projectID, params);
  };

  const handleDestroy = () => {
    const onConfirm = () => {
      deleteProject(projectID);
      closeConfirm();
      closeProjectForm();
    };

    const confirmConfig = {
      type: 'ask',
      title: `Project ${destroy}`,
      description: ask,
      confirm: onConfirm,
    };
    openConfirm(confirmConfig);
  };

  const submit = () => {
    if (action === 'edit') {
      handleUpdate();
    } else if (action === 'new') {
      handleCreate();
    }
    closeProjectForm();
  };

  const onChangeName = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_NAME, value });
  };

  const onChangeDescription = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_DESCRIPTION, value });
  };

  const onClickOverlay = (event) => event.stopPropagation();

  const title = action === 'new' ? 'Create Project' : 'Update Project';
  return (
    <div className="modalOverlay" onClick={closeProjectForm}>
      <div className="modalForm" onClick={onClickOverlay}>
        <div className="modalForm__title">{title}</div>
        {errors.length !== 0 && <ErrorMessage action="Project creation" errors={errors} />}
        <input
          type="text"
          className="modalForm__textInput"
          placeholder="プロジェクト名を入力"
          value={name}
          onChange={onChangeName}
        />
        <textarea
          className="modalForm__textarea"
          placeholder="プロジェクトの説明を入力"
          value={description}
          onChange={onChangeDescription}
        />
        <button type="button" onClick={submit} className="modalForm__button">
          {title}
        </button>
        {action === 'edit' && (
          <button type="button" onClick={handleDestroy} className="modalForm__button--delete">
            Delete Project
          </button>
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);
