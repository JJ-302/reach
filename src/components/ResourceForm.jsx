import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as projectActions from '../store/project/actions';
import * as resourceActions from '../store/resource/actions';
import * as confirmActions from '../store/confirm/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import { ask, destroy } from '../utils/Text';

const mapStateToProps = (state) => {
  const { resourceForm } = state;
  return {
    resourceID: resourceForm.id,
    errors: resourceForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { getAllProjects } = projectActions;
  const { openConfirm, closeConfirm } = confirmActions;
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
    closeConfirm: () => dispatch(closeConfirm()),
  };
};

const GET_COLORS = 'GET_COLORS';
const GET_RESOURCE_VALUES = 'GET_RESOURCE_VALUES';
const PICK_COLOR = 'PICK_COLOR';
const ON_CHANGE_NAME = 'ON_CHANGE_NAME';

const initialResourceLocalState = { name: '', colors: [], pickedColor: '' };

const resourceFormReducer = (state, action) => {
  switch (action.type) {
    case GET_COLORS:
      return {
        ...state,
        colors: action.payload,
      };
    case GET_RESOURCE_VALUES:
      return {
        ...state,
        name: action.payload.name,
        pickedColor: action.payload.pickedColor,
      };
    case PICK_COLOR:
      return {
        ...state,
        pickedColor: action.color,
      };
    case ON_CHANGE_NAME:
      return {
        ...state,
        name: action.value,
      };
    default:
      return state;
  }
};

const ResourceForm = (props) => {
  const {
    resourceID,
    createResource,
    updateResource,
    deleteResource,
    closeResourceForm,
    openConfirm,
    closeConfirm,
    getAllProjects,
    errors,
  } = props;

  const [state, dispatch] = useReducer(resourceFormReducer, initialResourceLocalState);
  const { name, colors, pickedColor } = state;
  const action = resourceID ? 'edit' : 'new';

  useEffect(() => {
    getColors();
    if (action === 'edit') {
      editResourceFormValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColors = async () => {
    const url = Utils.buildRequestUrl('/colors');
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }
    dispatch({ type: GET_COLORS, payload: response.data.colors });
  };

  const editResourceFormValue = async () => {
    const url = Utils.buildRequestUrl(`/resources/${resourceID}/edit`);
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }
    const { resource } = response.data;
    const payload = { name: resource.name, pickedColor: String(resource.color_id) };
    dispatch({ type: GET_RESOURCE_VALUES, payload });
  };

  const handleCreate = () => {
    const params = { name, color_id: pickedColor };
    createResource(params);
  };

  const handleUpdate = async () => {
    const params = { name, color_id: pickedColor };
    await updateResource(resourceID, params);
    getAllProjects();
  };

  const handleDestroy = () => {
    const onConfirm = () => {
      deleteResource(resourceID);
      closeConfirm();
      closeResourceForm();
    };

    const confirmConfig = {
      type: 'ask',
      title: `Resource ${destroy}`,
      description: ask,
      confirm: onConfirm,
    };
    openConfirm(confirmConfig);
  };

  const submit = async () => {
    if (action === 'edit') {
      await handleUpdate();
      getAllProjects();
    } else if (action === 'new') {
      handleCreate();
    }
    closeResourceForm();
  };

  const onPickColor = (event) => {
    const { color } = event.target.dataset;
    dispatch({ type: PICK_COLOR, color });
  };

  const onChangeName = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_NAME, value });
  };

  const onClickOverlay = (event) => event.stopPropagation();

  const title = action === 'new' ? 'Create Resource' : 'Update Resource';

  return (
    <div className="modalOverlay" onClick={closeResourceForm}>
      <div className="modalForm" onClick={onClickOverlay}>
        <div className="modalForm__title">{title}</div>
        {errors.length !== 0 && <ErrorMessage action="Resource creation" errors={errors} />}
        <input
          type="text"
          className="modalForm__textInput"
          placeholder="リソース名を入力"
          value={name}
          onChange={onChangeName}
        />
        <div className="modalForm__label">ラベルの色を選択</div>
        <div className="colorPallet">
          <ColorPallets
            colors={colors}
            pickedColor={pickedColor}
            onPickColor={onPickColor}
          />
        </div>
        <button type="button" onClick={submit} className="modalForm__button">
          {title}
        </button>
        {action === 'edit' && (
          <button type="button" onClick={handleDestroy} className="modalForm__button--delete">
            Delete Resource
          </button>
        )}
      </div>
    </div>
  );
};

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
