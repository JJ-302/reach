import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import * as taskActions from '../store/task/actions';
import * as projectActions from '../store/project/actions';
import * as confirmActions from '../store/confirm/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import { serverError, reload } from '../utils/Text';
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

class TaskForm extends Component {
  constructor(props) {
    super(props);
    const { taskID } = this.props;
    this.action = taskID ? 'edit' : 'new';
    this.submit = taskID ? this.handleUpdate : this.handleCreate;
    this.state = {
      name: '',
      selectedResource: '',
      startDate: null,
      endDate: null,
      complete: false,
      inCharge: [],
      description: '',
    };
  }

  componentDidMount() {
    if (this.action === 'edit') {
      this.editTaskFormValue();
    }
  }

  editTaskFormValue = async () => {
    const { taskID } = this.props;
    const token = localStorage.getItem('token');
    const url = Utils.buildRequestUrl(`/tasks/${taskID}/edit`);
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      const confirmConfig = { type: 'error', title: serverError, description: reload };
      const { openConfirm } = this.props;
      openConfirm(confirmConfig);
      return;
    }

    const {
      description,
      startDate,
      endDate,
      extend,
      name,
      percentComplete,
      userIds,
      resourceId,
    } = response.data.task;

    const complete = percentComplete === 'complete';
    const stringUserIds = userIds.map((userId) => String(userId));
    this.setState({
      name,
      complete,
      description,
      startDate: new Date(startDate),
      endDate: extend ? new Date(extend) : new Date(endDate),
      inCharge: stringUserIds,
      selectedResource: resourceId,
    });
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onChangeResource = (event) => {
    const selectedResource = event.target.value;
    this.setState({ selectedResource });
  }

  onChangeStartDate = (date) => {
    this.setState({ startDate: date });
  }

  onChangeEndDate = (date) => {
    this.setState({ endDate: date });
  }

  onCheck = () => {
    const { complete } = this.state;
    this.setState({ complete: !complete });
  }

  onClickAvatar = (event) => {
    const { inCharge } = this.state;
    const inChargeCopy = inCharge;
    const { id } = event.currentTarget.dataset;
    const targetIndex = inCharge.indexOf(id);
    if (targetIndex === notExist) {
      inChargeCopy.push(id);
    } else {
      inChargeCopy.splice(targetIndex, 1);
    }
    this.setState({ inCharge: inChargeCopy });
  }

  onChangeDescription = (event) => {
    const description = event.target.value;
    this.setState({ description });
  }

  handleCreate = () => {
    const { projectID, createTask } = this.props;
    const {
      name,
      selectedResource,
      startDate,
      endDate,
      inCharge,
      description,
    } = this.state;

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
  }

  handleUpdate = () => {
    const {
      name,
      selectedResource,
      startDate,
      endDate,
      complete,
      inCharge,
      description,
    } = this.state;

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
    const { taskID, updateTask } = this.props;
    updateTask(taskID, params);
  }

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const title = this.action === 'edit' ? 'Update Task' : 'Add Task';
    const {
      closeTaskForm, resources, users, errors,
    } = this.props;

    const {
      selectedResource,
      name,
      startDate,
      endDate,
      complete,
      inCharge,
      description,
    } = this.state;

    return (
      <div className="modalOverlay" onClick={closeTaskForm}>
        <div className="taskForm" onClick={this.onClickOverlay}>
          <div className="taskForm__close" onClick={closeTaskForm}>×</div>
          <div className="taskForm__title">{title}</div>
          {errors.length !== 0 && <ErrorMessage action="Task creation" errors={errors} />}
          <div className="taskFormRow">
            <div className="taskFormRow__label">タイトル</div>
            <input
              type="text"
              className="taskFormRow__name"
              value={name}
              onChange={this.onChangeName}
            />
          </div>
          <div className="taskFormRow">
            <div className="taskFormRow__label">リソース</div>
            <select
              value={selectedResource}
              onChange={this.onChangeResource}
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
              onChange={this.onChangeStartDate}
            />
          </div>
          <div className="taskFormRow">
            <div className="taskFormRow__label">終了日</div>
            <DatePicker
              className="taskFormRow__date"
              dateFormat="yyyy/MM/dd"
              showWeekNumbers
              selected={endDate}
              onChange={this.onChangeEndDate}
            />
          </div>
          {this.action === 'edit' && (
            <div className="taskFormRow">
              <div className="taskFormRow__label">完了</div>
              <div className="taskFormRow__complete" onClick={this.onCheck}>
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
                    <div data-id={user.id} onClick={this.onClickAvatar} className="avatar__wrapper">
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
              onChange={this.onChangeDescription}
            />
          </div>
          <button type="button" onClick={this.submit} className="taskForm__button">
            {title}
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
