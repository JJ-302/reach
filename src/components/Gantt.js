import React from 'react'
import Moment from 'moment'

import ChartBar from './ChartBar'
import '../css/Project.scss'
import Utils from '../Utils'

const start = Utils.dateRangeStart()
const baseChartWidth = 45

const calcOffset = (content) => {
  const offset = Moment(content.startDate, 'YYYY/MM/DD').diff(start, 'days')
  return (offset + 1) * baseChartWidth
}

const calcOffsetForWeeks = (content) => {
  const offset = Moment(content.startDate, 'YYYY/MM/DD').startOf('week').diff(start, 'weeks')
  return (offset + 1) * baseChartWidth
}

const calcChartWidthForWeeks = (task) => {
  const startDate = Moment(task.startDate, 'YYYY/MM/DD').startOf('week')
  const endDate = Moment(task.endDate, 'YYYY/MM/DD').endOf('week')
  return Math.ceil(endDate.diff(startDate, 'weeks', true))
}

const isBefore = (task) => Moment(task.startDate, 'YYYY/MM/DD').isBefore(start)

const Gantt = (props) => (
  props.projects.map((project) => (
    <div key={project.name} className="project">
      <div className="projectHeader" />
      {project.tasks && <Task tasks={project.tasks} scheduleType={props.scheduleType} />}
    </div>
  ))
)

const Task = (props) => (
  props.tasks.map((task) => {
    const offset = props.scheduleType === 'days' ? calcOffset(task) : calcOffsetForWeeks(task)
    let diff = props.scheduleType === 'days' ? task.duration : calcChartWidthForWeeks(task)
    if (isBefore(task)) {
      diff -= start.diff(Moment(task.startDate, 'YYYY/MM/DD'), 'days')
    }
    const chartWidth = baseChartWidth * diff
    return (
      <div key={task.id} style={{ paddingLeft: offset }} className="task">
        <ChartBar chartWidth={chartWidth} data={task} />
      </div>
    )
  })
)

export default Gantt
