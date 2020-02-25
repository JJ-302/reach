import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as taskActions from '../store/task/actions';
import * as projectActions from '../store/project/actions';
import * as confirmActions from '../store/confirm/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import '../css/Form.scss';

const notExist = -1;

const mapStateToProps = (state) => {
  const { resource, account, taskForm } = state;
  return {
    users: account.users,
    resources: resource.resources,
    taskID: taskForm.taskID,
    projectID: taskForm.projectID,
    errors: taskForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { closeTaskForm } = taskActions;
  const { createTask, updateTask } = projectActions;
  const { openConfirm } = confirmActions;
  return {
    closeTaskForm: () => dispatch(closeTaskForm()),
    createTask: (params) => dispatch(createTask(params)),
    updateTask: (id, params) => dispatch(updateTask(id, params)),
    openConfirm: (payload) => dispatch(openConfirm(payload)),
  };
};

const GET_TASK_VALUES = 'GET_TASK_VALUES';
const ON_CHANGE_NAME = 'ON_CHANGE_NAME';
const ON_CHANGE_DESCRIPTION = 'ON_CHANGE_DESCRIPTION';
const ON_CHANGE_RESOURCE = 'ON_CHANGE_RESOURCE';
const ON_CHANGE_START_DATE = 'ON_CHANGE_START_DATE';
const ON_CHANGE_END_DATE = 'ON_CHANGE_END_DATE';
const ON_CHECK_COMPLETE = 'ON_CHECK_COMPLETE';
const SELECT_AVATAR = 'SELECT_AVATAR';

const initialTaskLocalState = {
  name: '',
  selectedResource: '',
  startDate: null,
  endDate: null,
  complete: false,
  inCharge: [],
  description: '',
};

const taskFormReducer = (state, action) => {
  switch (action.type) {
    case GET_TASK_VALUES:
      return {
        ...state,
        name: action.payload.name,
        selectedResource: action.payload.selectedResource,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        complete: action.payload.complete,
        inCharge: action.payload.inCharge,
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
    case ON_CHANGE_RESOURCE:
      return {
        ...state,
        selectedResource: action.value,
      };
    case ON_CHANGE_START_DATE:
      return {
        ...state,
        startDate: action.value,
      };
    case ON_CHANGE_END_DATE:
      return {
        ...state,
        endDate: action.value,
      };
    case ON_CHECK_COMPLETE:
      return {
        ...state,
        complete: !state.complete,
      };
    case SELECT_AVATAR:
      return {
        ...state,
        inCharge: action.value,
      };
    default:
      return state;
  }
};

const TaskForm = (props) => {
  const {
    projectID,
    taskID,
    resources,
    users,
    errors,
    createTask,
    updateTask,
    closeTaskForm,
    openConfirm,
  } = props;

  const action = taskID ? 'edit' : 'new';

  const [state, dispatch] = useReducer(taskFormReducer, initialTaskLocalState);
  const {
    name,
    selectedResource,
    startDate,
    endDate,
    complete,
    inCharge,
    description,
  } = state;

  useEffect(() => {
    if (action === 'edit') {
      editTaskFormValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editTaskFormValue = async () => {
    const token = localStorage.getItem('token');
    const url = Utils.buildRequestUrl(`/tasks/${taskID}/edit`);
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }

    const { task } = response.data;
    const isComplete = task.percentComplete === 'complete';
    const stringUserIds = task.userIds.map((userId) => String(userId));
    const payload = {
      name: task.name,
      complete: isComplete,
      description: task.description,
      startDate: new Date(task.startDate),
      endDate: task.extend ? new Date(task.extend) : new Date(task.endDate),
      inCharge: stringUserIds,
      selectedResource: task.resourceId,
    };
    dispatch({ type: GET_TASK_VALUES, payload });
  };

  const onChangeName = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_NAME, value });
  };

  const onChangeDescription = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_DESCRIPTION, value });
  };

  const onChangeResource = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_RESOURCE, value });
  };

  const onChangeStartDate = (value) => dispatch({ type: ON_CHANGE_START_DATE, value });

  const onChangeEndDate = (value) => dispatch({ type: ON_CHANGE_END_DATE, value });

  const onCheckComplete = () => dispatch({ type: ON_CHECK_COMPLETE });

  const selectAvatar = (event) => {
    const inChargeCopy = inCharge;
    const { id } = event.currentTarget.dataset;
    const targetIndex = inCharge.indexOf(id);
    if (targetIndex === notExist) {
      inChargeCopy.push(id);
    } else {
      inChargeCopy.splice(targetIndex, 1);
    }
    dispatch({ type: SELECT_AVATAR, value: inChargeCopy });
  };

  const handleCreate = () => {
    const duration = Moment(endDate).diff(Moment(startDate), 'days');
    const params = {
      name,
      description,
      duration,
      resource_id: selectedResource,
      project_id: projectID,
      start_date: startDate,
      end_date: endDate,
      user_ids: inCharge,
    };
    createTask(params);
  };

  const handleUpdate = () => {
    const duration = Moment(endDate).diff(Moment(startDate), 'days');
    const percent_complete = complete ? 'complete' : 'progress';
    const params = {
      name,
      description,
      duration,
      percent_complete,
      resource_id: selectedResource,
      start_date: startDate,
      extend: endDate,
      user_ids: inCharge,
    };
    updateTask(taskID, params);
  };

  const submit = taskID ? handleUpdate : handleCreate;

  const onClickOverlay = (event) => event.stopPropagation();

  const title = action === 'edit' ? 'Update Task' : 'Add Task';
  return (
    <div className="modalOverlay" onClick={closeTaskForm}>
      <div className="taskForm" onClick={onClickOverlay}>
        <div className="taskForm__close" onClick={closeTaskForm}>×</div>
        <div className="taskForm__title">{title}</div>
        {errors.length !== 0 && <ErrorMessage action="Task creation" errors={errors} />}
        <div className="taskFormRow">
          <div className="taskFormRow__label">タイトル</div>
          <input
            type="text"
            className="taskFormRow__name"
            value={name}
            onChange={onChangeName}
          />
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">リソース</div>
          <select
            value={selectedResource}
            onChange={onChangeResource}
            className="taskFormRow__resource"
          >
            <option key="default" value={null} aria-label="...select" />
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>{resource.name}</option>
            ))}
          </select>
          <div className="taskFormRow__divide" />
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">開始日</div>
          <DatePicker
            className="taskFormRow__date"
            dateFormat="yyyy/MM/dd"
            showWeekNumbers
            selected={startDate}
            onChange={onChangeStartDate}
          />
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">終了日</div>
          <DatePicker
            className="taskFormRow__date"
            dateFormat="yyyy/MM/dd"
            showWeekNumbers
            selected={endDate}
            onChange={onChangeEndDate}
          />
        </div>
        {action === 'edit' && (
          <div className="taskFormRow">
            <div className="taskFormRow__label">完了</div>
            <div className="taskFormRow__complete" onClick={onCheckComplete}>
              <div className="taskFormRow__checkbox">
                <FontAwesomeIcon icon={['far', 'square']} />
                {complete && <FontAwesomeIcon icon={['fas', 'check']} className="taskFormRow__checked" />}
              </div>
            </div>
          </div>
        )}
        <div className="taskFormRow">
          <div className="taskFormRow__label">担当</div>
          <div className="taskFormRow__inCharge">
            {users.map((user) => {
              const targetIndex = inCharge.indexOf(String(user.id));
              return (
                <div key={user.id} className="avatar">
                  <div data-id={user.id} onClick={selectAvatar} className="avatar__wrapper">
                    <img src={user.avatar} alt={user.name} className="avatar__image" />
                    {targetIndex !== notExist && <div className="avatar__selected" />}
                  </div>
                  <div className="avatar__name">{user.name}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">説明</div>
          <textarea
            className="taskFormRow__description"
            value={description}
            onChange={onChangeDescription}
          />
        </div>
        <button type="button" onClick={submit} className="taskForm__button">
          {title}
        </button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
