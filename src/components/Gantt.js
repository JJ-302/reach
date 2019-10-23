import React from 'react'
import Moment from 'moment'
import '../css/Project.scss'

const baseChartWidth = 45

const calcOffset = (content) => {
  const start = Moment('2019-01-01')
  const offset = Moment(content.startDate, 'YYYY/MM/DD').diff(start, 'days') * baseChartWidth
  return offset
}

const Gantt = (props) => {
  const projects = props.projects.map((project) => {
    const chartWidth = baseChartWidth * project.duration
    const offset = calcOffset(project)
    return (
      <div key={project.name} className="project--gantt">
        <div style={{ paddingLeft: offset }} className="project__name">
          <div style={{ width: chartWidth }} className="project__chart" />
        </div>
        <Task tasks={project.tasks} />
      </div>
    )
  })
  return projects
}

const Task = (props) => {
  const tasks = props.tasks.map((task) => {
    const chartWidth = baseChartWidth * task.duration
    const offset = calcOffset(task)
    return (
      <div key={task.id} style={{ paddingLeft: offset }} className="task">
        <div style={{ width: chartWidth }} className="task__chart" />
      </div>
    )
  })
  return tasks
}

export default Gantt
