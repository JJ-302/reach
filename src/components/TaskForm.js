import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import '../css/Form.scss'

import members from '../TemporalyMembers'

const notExist = -1

export default class TaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      startDate: null,
      endDate: null,
      inCharge: [],
      description: '',
    }
  }

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
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

  render() {
    const { closeModal } = this.props
    const {
      name,
      startDate,
      endDate,
      inCharge,
      description,
    } = this.state

    return (
      <div className="taskForm">
        <div className="taskForm__close" onClick={closeModal}>×</div>
        <div className="taskForm__title">Add Task</div>
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
            <Users inCharge={inCharge} onClickAvatar={this.onClickAvatar} />
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
        <button type="button" className="taskForm__button">
          Add
        </button>
      </div>
    )
  }
}

const Users = (props) => {
  const { onClickAvatar, inCharge } = props
  const users = members.map((user) => {
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
  return users
}
