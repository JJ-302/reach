import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Confirm from './Confirm'

import Utils from '../utils/Utils'
import {
  badRequest,
  checkParams,
  reload,
  serverError,
} from '../utils/Text'

const notExist = -1

export default class GanttIndexHeader extends Component {
  constructor(props) {
    super(props)
    this.token = localStorage.getItem('token')
    this.state = {
      users: [],
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByDurationVisible: false,
      searchByUsersVisible: false,
      searchByResourceVisible: false,
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
      selectedResources: [],
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    }
  }

  componentDidMount() {
    this.getUserIndex()
  }

  getUserIndex = () => {
    const url = Utils.buildRequestUrl('/users')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ users, is_authenticated }) => {
        if (is_authenticated) {
          this.setState({ users })
        } else {
          this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
      })
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
      selectedResources,
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
      resources: selectedResources,
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then(({ projects }) => {
        if (projects === undefined) {
          this.openConfirm('error', serverError, reload, this.closeConfirm)
        } else {
          const { updateProject } = this.props
          updateProject(projects)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
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

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    })
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

  onClickResource = () => {
    const { searchByResourceVisible } = this.state
    this.setState({ searchByResourceVisible: !searchByResourceVisible })
  }

  onClickName = () => {
    const { searchByNameVisible } = this.state
    this.setState({ searchByNameVisible: !searchByNameVisible })
  }

  onClickDate = (event) => {
    const { type } = event.currentTarget.dataset
    const { searchByDateVisible } = this.state
    this.setState({ searchByDateVisible: !searchByDateVisible, dateType: type })
  }

  onClickDuration = () => {
    const { searchByDurationVisible } = this.state
    this.setState({ searchByDurationVisible: !searchByDurationVisible })
  }

  onClickInCharge = () => {
    const { searchByUsersVisible } = this.state
    this.setState({ searchByUsersVisible: !searchByUsersVisible })
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

  onClickResourceIcon = async (event) => {
    const { selectedResources } = this.state
    const selectedResourcesCopy = selectedResources
    const { id } = event.currentTarget.dataset
    const targetIndex = selectedResources.indexOf(id)
    if (targetIndex === notExist) {
      selectedResourcesCopy.push(id)
    } else {
      selectedResourcesCopy.splice(targetIndex, 1)
    }
    await this.setState({ selectedResources: selectedResourcesCopy })
    this.search()
  }

  clearSearchName = async () => {
    await this.setState({
      taskName: '',
      projectId: '',
      searchByNameVisible: false,
    })
    this.search()
  }

  clearSearchStartDate = async () => {
    await this.setState({
      startDateFrom: '',
      startDateTo: '',
      orderStartDate: '',
      searchByDateVisible: false,
    })
    this.search()
  }

  clearSearchEndDate = async () => {
    await this.setState({
      endDateFrom: '',
      endDateTo: '',
      orderEndDate: '',
      searchByDateVisible: false,
    })
    this.search()
  }

  clearSearchExtend = async () => {
    await this.setState({
      extendFrom: '',
      extendTo: '',
      orderExtend: '',
      searchByDateVisible: false,
    })
    this.search()
  }

  clearSearchDuration = async () => {
    await this.setState({ orderDuration: '', searchByDurationVisible: false })
    this.search()
  }

  clearSearchInCharge = async () => {
    await this.setState({ inCharge: [], searchByUsersVisible: false })
    this.search()
  }

  closeAllModal = () => {
    this.setState({
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByDurationVisible: false,
      searchByUsersVisible: false,
      searchByResourceVisible: false,
    })
  }

  stopPropagation = (event) => event.stopPropagation()

  render() {
    const { projects, resources } = this.props
    const {
      users,
      searchByNameVisible,
      searchByDateVisible,
      searchByDurationVisible,
      searchByUsersVisible,
      searchByResourceVisible,
      projectId,
      taskName,
      dateType,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      extendFrom,
      extendTo,
      orderStartDate,
      orderEndDate,
      orderExtend,
      orderDuration,
      inCharge,
      selectedResources,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state

    const resourceIconClass = selectedResources.length === 0 ? 'resourceIcon' : 'resourceIcon--selected'
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
        <div className="gantt-index-header__resource">
          <div className={resourceIconClass} onClick={this.onClickResource} />
        </div>
        <div className="gantt-index-header__name">
          {projectId === '' && taskName === ''
            ? <span className="gantt-index-header__label" onClick={this.onClickName}>Name</span>
            : (
              <div className="selected">
                <span className="selected__label" onClick={this.onClickName}>Name</span>
                <span className="selected__clear" onClick={this.clearSearchName}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__startDate">
          {startDateFrom === '' && startDateTo === '' && orderStartDate === ''
            ? (
              <span className="gantt-index-header__label" data-type="start" onClick={this.onClickDate}>
                StartDate
              </span>
            ) : (
              <div className="selected">
                <span className="selected__label" data-type="start" onClick={this.onClickDate}>
                  StartDate
                </span>
                <span className="selected__clear" onClick={this.clearSearchStartDate}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__endDate">
          {endDateFrom === '' && endDateTo === '' && orderEndDate === ''
            ? (
              <span className="gantt-index-header__label" data-type="end" onClick={this.onClickDate}>
                EndDate
              </span>
            ) : (
              <div className="selected">
                <span className="selected__label" data-type="end" onClick={this.onClickDate}>
                  EndDate
                </span>
                <span className="selected__clear" onClick={this.clearSearchEndDate}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__extend">
          {extendFrom === '' && extendTo === '' && orderExtend === ''
            ? (
              <span className="gantt-index-header__label" data-type="extend" onClick={this.onClickDate}>
                Extend
              </span>
            ) : (
              <div className="selected">
                <span className="selected__label" data-type="extend" onClick={this.onClickDate}>
                  Extend
                </span>
                <span className="selected__clear" onClick={this.clearSearchExtend}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__duration">
          {orderDuration === ''
            ? <span className="gantt-index-header__label" onClick={this.onClickDuration}>Duration</span>
            : (
              <div className="selected">
                <span className="selected__label" onClick={this.onClickDuration}>Duration</span>
                <span className="selected__clear" onClick={this.clearSearchDuration}>×</span>
              </div>
            )}
        </div>
        <div className="gantt-index-header__inCharge">
          {inCharge.length === 0
            ? <span className="gantt-index-header__label" onClick={this.onClickInCharge}>InCharge</span>
            : (
              <div className="selected">
                <span className="selected__label" onClick={this.onClickInCharge}>InCharge</span>
                <span className="selected__clear" onClick={this.clearSearchInCharge}>×</span>
              </div>
            )}
        </div>
        {searchByResourceVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByResource
              resources={resources}
              selectedResources={selectedResources}
              onClickResource={this.onClickResourceIcon}
              stopPropagation={this.stopPropagation}
            />
          </div>
        )}
        {searchByNameVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByName
              projectId={projectId}
              projects={projects}
              onChangeProject={this.onChangeProject}
              taskName={taskName}
              onChangeTask={this.onChangeTask}
              stopPropagation={this.stopPropagation}
            />
          </div>
        )}
        {searchByDateVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByDate
              dateType={dateType}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onChangeRangeStart={onChangeRangeStart}
              onChangeRangeEnd={onChangeRangeEnd}
              onChangeOrder={this.onChangeOrder}
              selected={order}
              stopPropagation={this.stopPropagation}
            />
          </div>
        )}
        {searchByDurationVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByDuration
              onChangeOrder={this.onChangeOrder}
              selected={orderDuration}
              stopPropagation={this.stopPropagation}
            />
          </div>
        )}
        {searchByUsersVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByUsers
              users={users}
              inCharge={inCharge}
              onClickAvatar={this.onClickAvatar}
              stopPropagation={this.stopPropagation}
            />
          </div>
        )}
        {confirmVisible && (
          <Confirm
            type={confirmType}
            closeConfirm={this.closeConfirm}
            title={confirmTitle}
            description={confirmDescription}
            confirm={confirm}
          />
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
  const { onChangeOrder, selected, stopPropagation } = props
  return (
    <div className="search--duration" onClick={stopPropagation}>
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
    stopPropagation,
  } = props

  const className = `search--${dateType}`
  const title = `Filter by ${dateType} date`
  return (
    <div className={className} onClick={stopPropagation}>
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
    stopPropagation,
  } = props

  return (
    <div className="search--name" onClick={stopPropagation}>
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

const SearchByUsers = (props) => {
  const {
    users,
    inCharge,
    onClickAvatar,
    stopPropagation,
  } = props

  return (
    <div className="search--user" onClick={stopPropagation}>
      <div className="search__label">Search by users</div>
      <div className="search__usersWrapper">
        <Users users={users} inCharge={inCharge} onClickAvatar={onClickAvatar} />
      </div>
    </div>
  )
}

const Resources = ({ resources, selectedResources, onClickResource }) => (
  resources.map((resource) => {
    const targetIndex = selectedResources.indexOf(String(resource.id))
    return (
      <div key={resource.id} className="resource">
        <div data-id={resource.id} onClick={onClickResource} className="resource__wrapper">
          <div className="resource__icon" style={{ backgroundColor: resource.color }} />
          {targetIndex !== notExist && <div className="resource__selected" />}
        </div>
        <div className="resource__name">{resource.name}</div>
      </div>
    )
  })
)

const SearchByResource = (props) => {
  const {
    resources,
    selectedResources,
    onClickResource,
    stopPropagation,
  } = props

  return (
    <div className="search--resource" onClick={stopPropagation}>
      <div className="search__label">Search by resource</div>
      <div className="search__resourceWrapper">
        <Resources
          resources={resources}
          selectedResources={selectedResources}
          onClickResource={onClickResource}
        />
      </div>
    </div>
  )
}
