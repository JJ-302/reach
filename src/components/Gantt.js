import React, { Component } from 'react'
import Moment from 'moment'

import ChartBar from './ChartBar'
import '../css/Project.scss'
import Utils from '../utils/Utils'

class GanttTask extends Component {
  constructor(props) {
    super(props)
    this.start = Utils.dateRangeStart()
    this.baseChartWidth = 45
  }

  calcOffset = (task) => {
    const start = Moment(new Date()).subtract(2, 'weeks')
    const offset = Moment(task.startDate, 'YYYY/MM/DD').startOf('days').diff(start, 'days')

    return (offset + 1) * this.baseChartWidth
  }

  calcOffsetForWeeks = (task) => {
    const offset = Math.ceil(
      Moment(task.startDate, 'YYYY/MM/DD').startOf('week').diff(this.start, 'weeks', true),
    )
    return offset * this.baseChartWidth
  }

  calcChartWidthForWeeks = (task) => {
    const end = task.extend || task.endDate
    const startDate = Moment(task.startDate, 'YYYY/MM/DD').startOf('week')
    const endDate = Moment(end, 'YYYY/MM/DD').endOf('week')
    return Math.ceil(endDate.diff(startDate, 'weeks', true))
  }

  isBefore = (task) => Moment(task.startDate, 'YYYY/MM/DD').isSameOrBefore(this.start)

  isBeforeForWeek = (task) => Moment(task.startDate, 'YYYY/MM/DD').isBefore(this.start.startOf('week'))

  render() {
    const { scheduleType, tasks } = this.props
    return (
      tasks.map((task) => {
        const offset = scheduleType === 'days' ? this.calcOffset(task) : this.calcOffsetForWeeks(task)
        let diff = scheduleType === 'days' ? task.duration : this.calcChartWidthForWeeks(task)

        if (this.isBefore(task) && scheduleType === 'days') {
          diff -= Math.ceil(
            this.start.diff(Moment(task.startDate, 'YYYY/MM/DD').startOf('days'), 'days', true),
          )
        } else if (this.isBeforeForWeek(task) && scheduleType === 'weeks') {
          diff -= Math.ceil(this.start.diff(Moment(task.startDate, 'YYYY/MM/DD'), 'week', true))
        } else if (scheduleType === 'days') {
          diff += 1
        }

        const chartWidth = this.baseChartWidth * diff
        const className = task.percentComplete === 'progress' ? 'task' : 'task--complete'

        return (
          <div key={task.id} style={{ paddingLeft: offset }} className={className}>
            <ChartBar chartWidth={chartWidth} data={task} />
          </div>
        )
      })
    )
  }
}

const Gantt = (props) => (
  props.projects.map((project) => (
    <div key={project.name} className="project">
      <div className="projectHeader" />
      {project.tasks && <GanttTask tasks={project.tasks} scheduleType={props.scheduleType} />}
    </div>
  ))
)

export default Gantt
