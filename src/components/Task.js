import React from 'react'
import '../css/Task.scss'

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

const Task = (props) => (
  props.tasks.map((task) => (
    <div key={task.id} data-action="edit" data-id={task.id} className="task" onClick={props.onClick}>
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

export default Task
