import React from 'react'
import Project from './Project'
import '../css/Main.scss'

import Data from '../TemporalyData'

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
      <div className="gantt-schedule" />
    </div>
  </div>
)

export default Main
