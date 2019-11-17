import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Utils from '../Utils'

const notExist = -1

export default class GanttIndexHeader extends Component {
  constructor(props) {
    super(props)
    this.token = localStorage.getItem('token')
    this.state = {
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByDurationVisible: false,
      searchByUsersVisible: false,
      dateType: '',
      projectId: '',
      taskName: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: '',
      extendFrom: '',
      extendTo: '',
      orderDuration: '',
      orderStartDate: '',
      orderEndDate: '',
      orderExtend: '',
      inCharge: [],
    }
  }

  search = () => {
    const {
      projectId,
      taskName,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      extendFrom,
      extendTo,
      orderDuration,
      orderStartDate,
      orderEndDate,
      orderExtend,
      inCharge,
    } = this.state

    const url = Utils.buildRequestUrl('/tasks/search')
    const params = {
      project_id: projectId,
      task_name: taskName,
      start_date: { from: startDateFrom, to: startDateTo, order: orderStartDate },
      end_date: { from: endDateFrom, to: endDateTo, order: orderEndDate },
      extend: { from: extendFrom, to: extendTo, order: orderExtend },
      duration: { order: orderDuration },
      in_charge: inCharge,
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then(({ projects }) => {
        const { updateProject } = this.props
        updateProject(projects)
      })
      .catch(() => {
        // TODO
      })
  }

  sortingByDateRange = (type) => {
    const {
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      extendFrom,
      extendTo,
      orderStartDate,
      orderEndDate,
      orderExtend,
    } = this.state

    switch (type) {
      case 'start':
        return {
          rangeStart: startDateFrom,
          rangeEnd: startDateTo,
          onChangeRangeStart: this.onChangeStartDateRangeS,
          onChangeRangeEnd: this.onChangeStartDateRangeE,
          order: orderStartDate,
        }
      case 'end':
        return {
          rangeStart: endDateFrom,
          rangeEnd: endDateTo,
          onChangeRangeStart: this.onChangeEndDateRangeS,
          onChangeRangeEnd: this.onChangeEndDateRangeE,
          order: orderEndDate,
        }
      case 'extend':
        return {
          rangeStart: extendFrom,
          rangeEnd: extendTo,
          onChangeRangeStart: this.onChangeExtendRangeS,
          onChangeRangeEnd: this.onChangeExtendRangeE,
          order: orderExtend,
        }
      default:
        return {}
    }
  }

  onClickName = () => {
    const { searchByNameVisible } = this.state
    this.setState({
      searchByNameVisible: !searchByNameVisible,
      searchByDateVisible: false,
      searchByDurationVisible: false,
      searchByUsersVisible: false,
    })
  }

  onClickDate = (event) => {
    const { type } = event.currentTarget.dataset
    const { searchByDateVisible } = this.state
    this.setState({
      searchByNameVisible: false,
      searchByDurationVisible: false,
      searchByUsersVisible: false,
      searchByDateVisible: !searchByDateVisible,
      dateType: type,
    })
  }

  onClickDuration = () => {
    const { searchByDurationVisible } = this.state
    this.setState({
      searchByDurationVisible: !searchByDurationVisible,
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByUsersVisible: false,
    })
  }

  onClickInCharge = () => {
    const { searchByUsersVisible } = this.state
    this.setState({
      searchByUsersVisible: !searchByUsersVisible,
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByDurationVisible: false,
    })
  }

  onChangeOrder = async (event) => {
    const { by } = event.currentTarget.dataset
    const order = event.target.value

    switch (by) {
      case 'duration':
        await this.setState({
          orderDuration: order,
          orderStartDate: '',
          orderEndDate: '',
          orderExtend: '',
        })
        break
      case 'start':
        await this.setState({
          orderDuration: '',
          orderStartDate: order,
          orderEndDate: '',
          orderExtend: '',
        })
        break
      case 'end':
        await this.setState({
          orderDuration: '',
          orderStartDate: '',
          orderEndDate: order,
          orderExtend: '',
        })
        break
      case 'extend':
        await this.setState({
          orderDuration: '',
          orderStartDate: '',
          orderEndDate: '',
          orderExtend: order,
        })
        break
      default:
    }
    this.search()
  }

  onChangeProject = async (event) => {
    const projectId = event.target.value
    await this.setState({ projectId })
    this.search()
  }

  onChangeTask = async (event) => {
    const taskName = event.target.value
    await this.setState({ taskName })
    this.search()
  }

  onChangeStartDateRangeS = async (startDateFrom) => {
    await this.setState({ startDateFrom })
    this.search()
  }

  onChangeStartDateRangeE = async (startDateTo) => {
    await this.setState({ startDateTo })
    this.search()
  }

  onChangeEndDateRangeS = async (endDateFrom) => {
    await this.setState({ endDateFrom })
    this.search()
  }

  onChangeEndDateRangeE = async (endDateTo) => {
    this.setState({ endDateTo })
    this.search()
  }

  onChangeExtendRangeS = async (extendFrom) => {
    await this.setState({ extendFrom })
    this.search()
  }

  onChangeExtendRangeE = async (extendTo) => {
    await this.setState({ extendTo })
    this.search()
  }

  onClickAvatar = async (event) => {
    const { inCharge } = this.state
    const inChargeCopy = inCharge
    const { id } = event.currentTarget.dataset
    const targetIndex = inCharge.indexOf(id)
    if (targetIndex === notExist) {
      inChargeCopy.push(id)
    } else {
      inChargeCopy.splice(targetIndex, 1)
    }
    await this.setState({ inCharge: inChargeCopy })
    this.search()
  }

  render() {
    const { projects, users } = this.props
    const {
      searchByNameVisible,
      searchByDateVisible,
      searchByDurationVisible,
      searchByUsersVisible,
      projectId,
      taskName,
      dateType,
      orderDuration,
      inCharge,
    } = this.state

    const dateProps = this.sortingByDateRange(dateType)
    const {
      rangeStart,
      rangeEnd,
      onChangeRangeStart,
      onChangeRangeEnd,
      order,
    } = dateProps

    return (
      <div className="gantt-index-header">
        <div className="gantt-index-header__name">
          <span onClick={this.onClickName}>Name</span>
        </div>
        <div className="gantt-index-header__startDate">
          <span data-type="start" onClick={this.onClickDate}>StartDate</span>
        </div>
        <div className="gantt-index-header__endDate">
          <span data-type="end" onClick={this.onClickDate}>EndDate</span>
        </div>
        <div className="gantt-index-header__extend">
          <span data-type="extend" onClick={this.onClickDate}>Extend</span>
        </div>
        <div className="gantt-index-header__duration">
          <span onClick={this.onClickDuration}>Duration</span>
        </div>
        <div className="gantt-index-header__inCharge">
          <span onClick={this.onClickInCharge}>InCharge</span>
        </div>
        {searchByNameVisible && (
          <SearchByName
            projectId={projectId}
            projects={projects}
            onChangeProject={this.onChangeProject}
            taskName={taskName}
            onChangeTask={this.onChangeTask}
          />
        )}
        {searchByDateVisible && (
          <SearchByDate
            dateType={dateType}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onChangeRangeStart={onChangeRangeStart}
            onChangeRangeEnd={onChangeRangeEnd}
            onChangeOrder={this.onChangeOrder}
            selected={order}
          />
        )}
        {searchByDurationVisible && (
          <SearchByDuration onChangeOrder={this.onChangeOrder} selected={orderDuration} />
        )}
        {searchByUsersVisible && (
          <SearchByUsers users={users} inCharge={inCharge} onClickAvatar={this.onClickAvatar} />
        )}
      </div>
    )
  }
}

const OrderBy = (props) => {
  const { onChangeOrder, by, selected } = props
  const selections = [{ label: 'ASC', value: 'ASC' }, { label: 'DESC', value: 'DESC' }]

  return (
    <select data-by={by} value={selected} onChange={onChangeOrder} className="search__order">
      <option key="default" value={null} aria-label="order" />
      {selections.map((selection) => (
        <option key={selection.label} value={selection.value}>{selection.label}</option>
      ))}
    </select>
  )
}

const SearchByDuration = (props) => {
  const { onChangeOrder, selected } = props

  return (
    <div className="search--duration">
      <div className="search__label">Order by duration</div>
      <OrderBy by="duration" onChangeOrder={onChangeOrder} selected={selected} />
      <div className="search__divide" />
    </div>
  )
}

const SearchByDate = (props) => {
  const {
    rangeStart,
    rangeEnd,
    onChangeRangeStart,
    onChangeRangeEnd,
    dateType,
    onChangeOrder,
    order,
  } = props

  const className = `search--${dateType}`
  const title = `Filter by ${dateType} date`

  return (
    <div className={className}>
      <div className="search__label">Order by duration</div>
      <OrderBy by={dateType} onChangeOrder={onChangeOrder} selected={order} />
      <div className="search__divide" />
      <div className="search__label">{title}</div>
      <div className="search__dateWrapper">
        <DatePicker
          className="search__dateRange"
          dateFormat="yyyy/MM/dd"
          showWeekNumbers
          placeholderText="Select range start"
          selected={rangeStart}
          onChange={onChangeRangeStart}
        />
        <DatePicker
          className="search__dateRange"
          dateFormat="yyyy/MM/dd"
          showWeekNumbers
          placeholderText="Select range end"
          selected={rangeEnd}
          onChange={onChangeRangeEnd}
        />
      </div>
    </div>
  )
}

const SearchByName = (props) => {
  const {
    projectId,
    projects,
    onChangeProject,
    taskName,
    onChangeTask,
  } = props

  return (
    <div className="search--name">
      <div className="search__label">Filter by Project</div>
      <select value={projectId} onChange={onChangeProject} className="search__project">
        <option key="default" value={null} aria-label="selectProject" />
        {projects.map((project) => (
          <option key={project.name} value={project.id}>{project.name}</option>
        ))}
      </select>
      <div className="search__divide" />
      <div className="search__label">Search by Task name</div>
      <input type="text" className="search__task" value={taskName} onChange={onChangeTask} />
    </div>
  )
}

const Users = ({ users, onClickAvatar, inCharge }) => (
  users.map((user) => {
    const targetIndex = inCharge.indexOf(String(user.id))
    return (
      <div key={user.id} className="avatar">
        <div data-id={user.id} onClick={onClickAvatar} className="avatar__wrapper">
          <img src={user.avatar} alt={user.name} className="avatar__image" />
          {targetIndex !== notExist && <div className="avatar__selected" />}
        </div>
        <div className="avatar__name">{user.name}</div>
      </div>
    )
  })
)

const SearchByUsers = ({ users, inCharge, onClickAvatar }) => (
  <div className="search--user">
    <div className="search__label">Search by users</div>
    <div className="search__usersWrapper">
      <Users users={users} inCharge={inCharge} onClickAvatar={onClickAvatar} />
    </div>
  </div>
)
