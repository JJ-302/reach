import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import * as taskActions from '../store/task/actions';
import Confirm from './Confirm';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import {
  badRequest,
  checkParams,
  reload,
  serverError,
} from '../utils/Text';

import '../css/Form.scss';

const notExist = -1;

const mapStateToProps = (state) => {
  const { resource, account } = state;
  return {
    users: account.users,
    resources: resource.resources,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { closeTaskForm } = taskActions;
  return {
    closeTaskForm: () => dispatch(closeTaskForm()),
  };
};

class TaskForm extends Component {
  constructor(props) {
    super(props);
    const { taskID } = this.props;
    this.action = taskID ? 'edit' : 'new';
    this.state = {
      name: '',
      selectedResource: '',
      startDate: null,
      endDate: null,
      complete: false,
      inCharge: [],
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
      this.editTaskFormValue();
    }
  }

  editTaskFormValue = async () => {
    const { taskID } = this.props;
    this.token = localStorage.getItem('token');
    const url = Utils.buildRequestUrl(`/tasks/${taskID}/edit`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    });

    const { is_authenticated, task } = await response.json();

    if (is_authenticated) {
      const {
        description,
        startDate,
        endDate,
        extend,
        name,
        percentComplete,
        userIds,
        resourceId,
      } = task;

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
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm);
    }
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

  createTask = async () => {
    const { projectID, taskID, action } = this.props;
    const {
      name,
      selectedResource,
      startDate,
      endDate,
      complete,
      inCharge,
      description,
    } = this.state;

    const request = Utils.preparingRequest(action, taskID, 'tasks');
    if (request === null) {
      return;
    }
    const url = Utils.buildRequestUrl(request.uriPattern);
    const duration = Moment(endDate).diff(Moment(startDate), 'days');
    const percent_complete = complete ? 'complete' : 'progress';
    const params = {
      name,
      description,
      duration,
      percent_complete,
      resource_id: selectedResource,
      project_id: projectID,
      start_date: startDate,
      end_date: endDate,
      user_ids: inCharge,
    };

    if (action === 'edit') {
      params.extend = endDate;
      delete params.end_date;
    }

    const response = await fetch(url, {
      method: request.method,
      headers: { 'X-Reach-token': this.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
    });

    const { is_created, errors, task } = await response.json();
    if (is_created) {
      const { refresh, index } = this.props;
      refresh(task, index, action);
      this.setState({ errors: [] });
    } else {
      this.setState({ errors });
    }
  }

  render() {
    const { closeTaskForm, resources } = this.props;
    const title = this.action === 'edit' ? 'Update Task' : 'Add Task';
    const {
      selectedResource,
      name,
      startDate,
      endDate,
      complete,
      inCharge,
      description,
      errors,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    return (
      <div className="taskForm">
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
                {complete
                  && <FontAwesomeIcon icon={['fas', 'check']} className="taskFormRow__checked" />}
              </div>
            </div>
          </div>
        )}
        <div className="taskFormRow">
          <div className="taskFormRow__label">担当</div>
          <div className="taskFormRow__inCharge">
            <Users inCharge={inCharge} onClickAvatar={this.onClickAvatar} />
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
        <button type="button" onClick={this.createTask} className="taskForm__button">
          {title}
        </button>
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

const Users = connect(mapStateToProps)(({ users, onClickAvatar, inCharge }) => (
  users.map((user) => {
    const targetIndex = inCharge.indexOf(String(user.id));
    return (
      <div key={user.id} className="avatar">
        <div data-id={user.id} onClick={onClickAvatar} className="avatar__wrapper">
          <img src={user.avatar} alt={user.name} className="avatar__image" />
          {targetIndex !== notExist && <div className="avatar__selected" />}
        </div>
        <div className="avatar__name">{user.name}</div>
      </div>
    );
  })
));

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
