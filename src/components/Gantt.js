import React from 'react'
import '../css/Project.scss'

const Gantt = (props) => {
  const projects = props.projects.map((project) => (
    <div key={project.name} className="project--gantt">
      <div className="project__chart">
        {project.name}
      </div>
      <Task tasks={project.tasks} />
    </div>
  ))
  return projects
}

const Task = (props) => {
  const tasks = props.tasks.map((task) => (
    <div key={task.id} className="task">
      <div className="task__name">{task.title}</div>
    </div>
  ))
  return tasks
}

export default Gantt
