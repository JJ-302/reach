import React from 'react'
import Project from './Project'
import Gantt from './Gantt'
import '../css/Main.scss'

import Data from '../TemporalyData'
import date from '../TemporalyDateRange'

const sun = 0
const sat = 6

const whatDayIsToday = (day) => {
  switch (day.get('day')) {
    case sun:
      return '--sun'
    case sat:
      return '--sat'
    default:
      return ''
  }
}

const Schedule = () => {
  const days = []
  for (let day = date.startDate; day <= date.endtDate; day.add(1, 'days')) {
    const modifire = `gantt-schedule-header__date${whatDayIsToday(day)}`
    days.push(
      <div className={modifire} key={day.format('YYYYMMDD')}>
        {day.format('MMM D')}
      </div>,
    )
  }
  return days
}

const Main = () => (
  <div className="mainContainer">
    <div className="header" />
    <div className="gantt">
      <div className="gantt-index">
        <div className="gantt-index-header">
          <div className="gantt-index-header__name">Name</div>
          <div className="gantt-index-header__startDate">StartDate</div>
          <div className="gantt-index-header__endDate">EndDate</div>
          <div className="gantt-index-header__duration">Duration</div>
          <div className="gantt-index-header__progress">Progress</div>
        </div>
        <Project projects={Data} />
      </div>
      <div className="gantt-schedule">
        <div className="gantt-schedule-header">
          <Schedule />
        </div>
        <Gantt projects={Data} />
      </div>
    </div>
  </div>
)

export default Main
