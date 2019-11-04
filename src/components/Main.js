import React, { PureComponent } from 'react'
import Moment from 'moment'

import SideBar from './SideBar'
import Project from './Project'
import Gantt from './Gantt'
import '../css/Main.scss'

import Utils from '../Utils'

const sun = 0
const sat = 6
const startDate = Utils.dateRangeStart()
const endDate = Utils.dateRangeEnd()


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
    const startOfWeek = day.startOf('week')
    attr.formatDate = `W${day.format('W')} ${startOfWeek.format('M/D')}`
    attr.className = 'gantt-schedule-header__week'
  }
  return attr
}

const Schedule = ({ scheduleType }) => {
  const schedules = []
  for (let day = Moment(startDate); day <= endDate; day.add(1, scheduleType)) {
    const attr = scheduleAttr(day, scheduleType)
    schedules.push(
      <div className={attr.className} key={day.format('YYYYMMDD')}>
        {attr.formatDate}
      </div>,
    )
  }
  return schedules
}

const Avatars = ({ users }) => (
  users.map((user) => (
    <img key={user.id} src={user.avatar} alt={user.name} className="member__avatar" />
  ))
)

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
          onClick={onClick}
          onKeyUp={onClick}
          data-type="weeks"
          role="link"
          tabIndex="0"
        >
          Week
        </div>
        <div className="switchView__divider">|</div>
        <div
          className={className.days}
          onClick={onClick}
          onKeyUp={onClick}
          data-type="days"
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
    this.state = {
      users: [],
      projects: [],
      type: 'days',
    }
  }

  componentDidMount() {
    this.getUserIndex()
  }

  getUserIndex = () => {
    const url = Utils.buildRequestUrl('/projects')
    const token = localStorage.getItem('token')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': token },
    })
      .then((_res) => _res.json())
      .then(({ is_authenticated, users, projects }) => {
        if (is_authenticated) {
          this.setState({ users, projects })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  changeScheduleType = (event) => {
    const { type } = event.target.dataset
    this.setState({ type })
  }

  refreshProject = (project) => {
    const { projects } = this.state
    const projectsCopy = projects.slice()
    projectsCopy.push(project)
    this.setState({ projects: projectsCopy })
  }

  refreshTask = (task, index) => {
    const { projects } = this.state
    const projectsCopy = projects.slice()
    projectsCopy[index].tasks.push(task)
    this.setState({ projects: projectsCopy })
  }

  render() {
    const { type, users, projects } = this.state
    return (
      <div className="App">
        <SideBar refreshProject={this.refreshProject} />
        <div className="mainContainer">
          <Header users={users} scheduleType={type} onClick={this.changeScheduleType} />
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
              <Project refreshTask={this.refreshTask} projects={projects} />
            </div>
            <div className="gantt-schedule">
              <div className="gantt-schedule-header">
                <Schedule scheduleType={type} />
              </div>
              <Gantt projects={projects} scheduleType={type} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
