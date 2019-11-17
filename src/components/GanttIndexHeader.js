import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Utils from '../Utils'

export default class GanttIndexHeader extends Component {
  constructor(props) {
    super(props)
    this.token = localStorage.getItem('token')
    this.state = {
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByDurationVisible: false,
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
    } = this.state

    const url = Utils.buildRequestUrl('/tasks/search')
    const params = {
      project_id: projectId,
      task_name: taskName,
      start_date: { from: startDateFrom, to: startDateTo, order: orderStartDate },
      end_date: { from: endDateFrom, to: endDateTo, order: orderEndDate },
      extend: { from: extendFrom, to: extendTo, order: orderExtend },
      duration: { order: orderDuration },
    }

    console.log(params)
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
      .catch((err) => {
        console.log('error: ', err)
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
    })
  }

  onClickDate = (event) => {
    const { type } = event.currentTarget.dataset
    const { searchByDateVisible } = this.state
    this.setState({
      searchByNameVisible: false,
      searchByDurationVisible: false,
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

  render() {
    const { projects } = this.props
    const {
      searchByNameVisible,
      searchByDateVisible,
      searchByDurationVisible,
      projectId,
      taskName,
      dateType,
      orderDuration,
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
        <div className="gantt-index-header__inCharge">InCharge</div>
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
