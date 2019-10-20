import React from 'react'
import Task from './Task'
import '../css/Project.scss'

const Project = (props) => {
  const projects = props.projects.map((project) => (
    <div key={project.name} className="project">
      <div className="project__name">
        {project.name}
      </div>
      <Task tasks={project.tasks} />
    </div>
  ))
  return projects
}

export default Project
