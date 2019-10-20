import React from 'react'
import '../css/Task.scss'

const Task = (props) => {
  const tasks = props.tasks.map((task) => (
    <div key={task.id} className="task">
      <div className="task__name">{task.title}</div>
      <div className="task__startDate">{task.startDate}</div>
      <div className="task__endDate">{task.endDate}</div>
      <div className="task__duration">{task.duration}</div>
      <div className="task__progress">
        {task.percentComplete}
        %
      </div>
    </div>
  ))
  return tasks
}

export default Task
