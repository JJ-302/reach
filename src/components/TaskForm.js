import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import ErrorMessage from './Error'
import '../css/Form.scss'
import Utils from '../Utils'

const notExist = -1

export default class TaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      resources: [],
      users: [],
      name: '',
      resource: '',
      startDate: null,
      endDate: null,
      inCharge: [],
      description: '',
      errors: [],
    }
  }

  componentDidMount() {
    this.getTaskFormValue()
  }

  getTaskFormValue = () => {
    const token = localStorage.getItem('token')
    const url = Utils.buildRequestUrl('/tasks/new')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': token },
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_authenticated, resources, users } = res
        if (is_authenticated) {
          this.setState({ resources, users, token })
        }
      })
      .catch(() => {
        // TODO
      })
  }

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
    const {
      token,
      name,
      resource,
      startDate,
      endDate,
      inCharge,
      description,
    } = this.state

    const url = Utils.buildRequestUrl('/tasks')
    const duration = Moment(endDate).diff(Moment(startDate), 'days')
    const params = {
      name,
      description,
      duration,
      resource_id: resource,
      project_id: 1,
      start_date: startDate,
      end_date: endDate,
      user_ids: inCharge,
    }

    fetch(url, {
      method: 'POST',
      headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then(({ is_created, errors, task }) => {
        if (is_created) {
          const { tasks, onRefresh } = this.props
          tasks.push(task)
          onRefresh(tasks)
          this.setState({ errors: [] })
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  render() {
    const { closeModal } = this.props
    const {
      users,
      resources,
      resource,
      name,
      startDate,
      endDate,
      inCharge,
      description,
      errors,
    } = this.state

    return (
      <div className="taskForm">
        <div className="taskForm__close" onClick={closeModal}>×</div>
        <div className="taskForm__title">Add Task</div>
        {errors.length !== 0 && <ErrorMessage action="Task creation" errors={errors} />}
        <div className="taskFormRow">
          <div className="taskFormRow__label">Name</div>
          <input
            type="text"
            className="taskFormRow__name"
            value={name}
            onChange={this.onChangeName}
          />
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">Resource</div>
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
          <div className="taskFormRow__label">Start date</div>
          <DatePicker
            className="taskFormRow__date"
            dateFormat="yyyy/MM/dd"
            showWeekNumbers
            selected={startDate}
            onChange={this.onChangeStartDate}
          />
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">End date</div>
          <DatePicker
            className="taskFormRow__date"
            dateFormat="yyyy/MM/dd"
            showWeekNumbers
            selected={endDate}
            onChange={this.onChangeEndDate}
          />
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">In charge</div>
          <div className="taskFormRow__inCharge">
            <Users users={users} inCharge={inCharge} onClickAvatar={this.onClickAvatar} />
          </div>
        </div>
        <div className="taskFormRow">
          <div className="taskFormRow__label">Description</div>
          <textarea
            className="taskFormRow__description"
            value={description}
            onChange={this.onChangeDescription}
          />
        </div>
        <button type="button" onClick={this.createTask} className="taskForm__button">
          Add
        </button>
      </div>
    )
  }
}

const Resources = (props) => {
  const { resources } = props
  const options = resources.map((resource) => (
    <option key={resource.id} value={resource.id}>{resource.name}</option>
  ))
  return options
}

const Users = (props) => {
  const { users, onClickAvatar, inCharge } = props
  return users.map((user) => {
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
}
