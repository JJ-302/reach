import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../css/Task.scss'
import Utils from '../Utils'

const Avatars = ({ members }) => (
  members.map((member, i) => {
    if (i > 3) {
      return null
    }
    if (i < 3) {
      return <img key={member.name} src={member.avatar} alt={member.name} className="task__avatar" />
    }
    return <div key={String(i)} className="task__avatar--length">{members.length}</div>
  })
)

export default class Task extends Component {
  handleDestroy = (event) => {
    event.stopPropagation()
    this.token = localStorage.getItem('token')
    const { id } = event.currentTarget.dataset
    const url = Utils.buildRequestUrl(`/tasks/${id}`)

    fetch(url, {
      method: 'DELETE',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_delete, task }) => {
        if (is_delete) {
          const { index, refresh } = this.props
          refresh(task, index, 'destroy')
        }
      })
      .catch(() => {
        // TODO
      })
  }

  onClickOverlay = (event) => {
    event.stopPropagation()
  }

  render() {
    const { tasks, onClick, destroyMode } = this.props
    return (
      tasks.map((task) => (
        <div key={task.id} data-action="edit" data-id={task.id} className="task" onClick={onClick}>
          <div className="task__icon" onClick={this.onClickOverlay}>
            {destroyMode ? (
              <FontAwesomeIcon
                data-id={task.id}
                icon={['fas', 'minus-circle']}
                className="task__delete"
                onClick={this.handleDestroy}
              />
            ) : <div className="task__resource" style={{ backgroundColor: task.resource.color }} />}
          </div>
          <div className="task__name">{task.name}</div>
          <div className="task__startDate">{task.startDate}</div>
          <div className="task__endDate">{task.endDate}</div>
          <div className="task__extend">{task.extend}</div>
          <div className="task__duration">{task.duration}</div>
          <div className="task__inCharge">
            <Avatars members={task.users} />
          </div>
        </div>
      ))
    )
  }
}
