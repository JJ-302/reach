import React, { PureComponent } from 'react'
import Moment from 'moment'

import Project from './Project'
import Gantt from './Gantt'
import '../css/Main.scss'

import Utils from '../Utils'

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

const scheduleAttr = (day, scheduleType) => {
  const attr = {}
  if (scheduleType === 'days') {
    attr.formatDate = day.format('MMM D')
    attr.className = `gantt-schedule-header__date${whatDayIsToday(day)}`
  } else {
    const startOfWeek = day.startOf('week').add(1, 'day')
    attr.formatDate = `W${day.format('W')} ${startOfWeek.format('M/D')}`
    attr.className = 'gantt-schedule-header__week'
  }
  return attr
}

const Schedule = ({ scheduleType }) => {
  const schedules = []
  for (let day = Moment(date.startDate); day <= date.endDate; day.add(1, scheduleType)) {
    const attr = scheduleAttr(day, scheduleType)
    schedules.push(
      <div className={attr.className} key={day.format('YYYYMMDD')}>
        {attr.formatDate}
      </div>,
    )
  }
  return schedules
}

const Avatars = ({ users }) => {
  const avatars = users.map((user) => (
    <img key={user.id} src={user.avatar} alt={user.name} className="member__avatar" />
  ))
  return avatars
}

const Header = (props) => {
  const { users, scheduleType, onClick } = props
  const className = { weeks: 'switchView__button', days: 'switchView__button' }
  if (scheduleType === 'weeks') {
    className.weeks += '--disable'
  } else if (scheduleType === 'days') {
    className.days += '--disable'
  }
  return (
    <div className="header">
      <div className="switchView">
        <div
          className={className.weeks}
          onClick={() => onClick('weeks')}
          onKeyUp={() => onClick('weeks')}
          role="link"
          tabIndex="0"
        >
          Week
        </div>
        <div className="switchView__divider">|</div>
        <div
          className={className.days}
          onClick={() => onClick('days')}
          onKeyUp={() => onClick('days')}
          role="link"
          tabIndex="0"
        >
          Day
        </div>
      </div>
      <div className="member">
        <Avatars users={users} />
      </div>
    </div>
  )
}

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    this.getUserIndex()
    this.state = {
      users: [],
      scheduleType: 'days',
    }
  }

  getUserIndex = () => {
    const url = Utils.buildRequestUrl('/initials')
    const token = localStorage.getItem('token')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': token },
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_authenticated, users } = res
        if (is_authenticated) {
          this.setState({ users })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  changeScheduleType = (scheduleType) => {
    this.setState({ scheduleType })
  }

  render() {
    const { scheduleType, users } = this.state
    return (
      <div className="mainContainer">
        <Header users={users} scheduleType={scheduleType} onClick={this.changeScheduleType} />
        <div className="gantt">
          <div className="gantt-index">
            <div className="gantt-index-header">
              <div className="gantt-index-header__name">Name</div>
              <div className="gantt-index-header__startDate">StartDate</div>
              <div className="gantt-index-header__endDate">EndDate</div>
              <div className="gantt-index-header__extend">Extend</div>
              <div className="gantt-index-header__duration">Duration</div>
              <div className="gantt-index-header__inCharge">InCharge</div>
            </div>
            <Project projects={Data} />
          </div>
          <div className="gantt-schedule">
            <div className="gantt-schedule-header">
              <Schedule scheduleType={scheduleType} />
            </div>
            <Gantt projects={Data} scheduleType={scheduleType} />
          </div>
        </div>
      </div>
    )
  }
}
