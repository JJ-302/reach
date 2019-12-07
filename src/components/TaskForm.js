import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import Confirm from './Confirm'
import ErrorMessage from './Error'
import Utils from '../utils/Utils'
import {
  badRequest,
  checkParams,
  reload,
  serverError,
} from '../utils/Text'

import '../css/Form.scss'

const notExist = -1

export default class TaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resources: [],
      users: [],
      name: '',
      resource: '',
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
    }
  }

  componentDidMount() {
    const { taskID, action } = this.props
    if (action === 'new') {
      this.getTaskFormValue()
    } else if (action === 'edit') {
      this.editTaskFormValue(taskID)
    }
  }

  getTaskFormValue = () => {
    this.token = localStorage.getItem('token')
    const url = Utils.buildRequestUrl('/tasks/new')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_authenticated, resources, users } = res
        if (is_authenticated) {
          this.setState({ resources, users })
        } else {
          this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
      })
  }

  editTaskFormValue = (taskID) => {
    this.token = localStorage.getItem('token')
    const url = Utils.buildRequestUrl(`/tasks/${taskID}/edit`)
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_authenticated, resources, users } = res
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
          } = res.task

          const complete = percentComplete === 'complete'
          const stringUserIds = userIds.map((userId) => String(userId))
          this.setState({
            resources,
            users,
            name,
            complete,
            description,
            startDate: new Date(startDate),
            endDate: extend ? new Date(extend) : new Date(endDate),
            inCharge: stringUserIds,
            resource: resourceId,
          })
        } else {
          this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
      })
  }

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    })
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onChangeResource = (event) => {
    const resource = event.target.value
    this.setState({ resource })
  }

  onChangeStartDate = (date) => {
    this.setState({ startDate: date })
  }

  onChangeEndDate = (date) => {
    this.setState({ endDate: date })
  }

  onCheck = () => {
    const { complete } = this.state
    this.setState({ complete: !complete })
  }

  onClickAvatar = (event) => {
    const { inCharge } = this.state
    const inChargeCopy = inCharge
    const { id } = event.currentTarget.dataset
    const targetIndex = inCharge.indexOf(id)
    if (targetIndex === notExist) {
      inChargeCopy.push(id)
    } else {
      inChargeCopy.splice(targetIndex, 1)
    }
    this.setState({ inCharge: inChargeCopy })
  }

  onChangeDescription = (event) => {
    const description = event.target.value
    this.setState({ description })
  }

  createTask = () => {
    const { id, taskID, action } = this.props
    const {
      name,
      resource,
      startDate,
      endDate,
      complete,
      inCharge,
      description,
    } = this.state

    const request = Utils.preparingRequest(action, taskID, 'tasks')
    if (request === null) {
      return
    }
    const url = Utils.buildRequestUrl(request.uriPattern)
    const duration = Moment(endDate).diff(Moment(startDate), 'days')
    const percent_complete = complete ? 'complete' : 'progress'
    const params = {
      name,
      description,
      duration,
      percent_complete,
      resource_id: resource,
      project_id: id,
      start_date: startDate,
      end_date: endDate,
      user_ids: inCharge,
    }

    if (action === 'edit') {
      params.extend = endDate
      delete params.end_date
    }

    fetch(url, {
      method: request.method,
      headers: { 'X-Reach-token': this.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then(({ is_created, errors, task }) => {
        if (is_created) {
          const { refresh, index } = this.props
          refresh(task, index, action)
          this.setState({ errors: [] })
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
      })
  }

  render() {
    const { closeModal, action } = this.props
    const title = action === 'edit' ? 'Update' : 'Add'
    const {
      users,
      resources,
      resource,
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
    } = this.state

    return (
      <div className="taskForm">
        <div className="taskForm__close" onClick={closeModal}>×</div>
        <div className="taskForm__title">
          {title}
          Task
        </div>
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
            value={resource}
            onChange={this.onChangeResource}
            className="taskFormRow__resource"
          >
            <option key="default" value={null} aria-label="...select" />
            <Resources resources={resources} />
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
        {action === 'edit' && (
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
            <Users users={users} inCharge={inCharge} onClickAvatar={this.onClickAvatar} />
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
    )
  }
}

const Resources = ({ resources }) => (
  resources.map((resource) => (
    <option key={resource.id} value={resource.id}>{resource.name}</option>
  ))
)

const Users = ({ users, onClickAvatar, inCharge }) => (
  users.map((user) => {
    const targetIndex = inCharge.indexOf(String(user.id))
    return (
      <div key={user.id} className="avatar">
        <div data-id={user.id} onClick={onClickAvatar} className="avatar__wrapper">
          <img src={user.avatar} alt={user.name} className="avatar__image" />
          {targetIndex !== notExist && <div className="avatar__selected" />}
        </div>
        <div className="avatar__name">{user.name}</div>
      </div>
    )
  })
)
