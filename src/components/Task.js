import React from 'react'
import '../css/Task.scss'

const Avatars = ({ members }) => {
  const avatars = members.map((member) => (
    <img key={member.name} src={member.avatar} alt={member.name} className="task__avatar" />
  ))
  return avatars
}

const Task = (props) => {
  const tasks = props.tasks.map((task) => (
    <div key={task.id} className="task">
      <div className="task__name">{task.name}</div>
      <div className="task__startDate">{task.startDate}</div>
      <div className="task__endDate">{task.endDate}</div>
      <div className="task__extend">{task.extend}</div>
      <div className="task__duration">{task.duration}</div>
      <div className="task__inCharge">
        <Avatars members={task.member_tasks} />
      </div>
    </div>
  ))
  return tasks
}

export default Task
