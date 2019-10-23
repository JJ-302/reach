import React from 'react'
import Moment from 'moment'
import '../css/Project.scss'

import date from '../TemporalyDateRange'

const baseChartWidth = 45

const calcOffset = (content) => {
  const start = Moment(date.startDate)
  const offset = Moment(content.startDate, 'YYYY/MM/DD').diff(start, 'days')
  return offset * baseChartWidth
}

const calcOffsetForWeeks = (content) => {
  const start = Moment(date.startDate).startOf('week')
  const offset = Moment(content.startDate, 'YYYY/MM/DD').startOf('week').diff(start, 'weeks')
  return offset * baseChartWidth
}

const calcChartWidthForWeeks = (task) => {
  const startDate = Moment(task.startDate, 'YYYY/MM/DD').startOf('week')
  const endDate = Moment(task.endDate, 'YYYY/MM/DD').endOf('week')
  return Math.ceil(endDate.diff(startDate, 'weeks', true))
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
        <Task tasks={project.tasks} scheduleType={props.scheduleType} />
      </div>
    )
  })
  return projects
}

const Task = (props) => {
  const tasks = props.tasks.map((task) => {
    const diff = props.scheduleType === 'days' ? task.duration : calcChartWidthForWeeks(task)
    const offset = props.scheduleType === 'days' ? calcOffset(task) : calcOffsetForWeeks(task)
    const chartWidth = baseChartWidth * diff
    return (
      <div key={task.id} style={{ paddingLeft: offset }} className="task">
        <div style={{ width: chartWidth }} className="task__chart" />
      </div>
    )
  })
  return tasks
}

export default Gantt
