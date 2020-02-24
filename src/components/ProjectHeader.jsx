import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import * as projectActions from '../store/project/actions';
import * as accountActions from '../store/account/actions';

const notExist = -1;

const stopPropagation = (event) => event.stopPropagation();

const mapStateToProps = (state) => {
  const { project, resource, account } = state;
  return {
    projects: project.projects,
    resources: resource.resources,
    users: account.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { searchProjects } = projectActions;
  const { getAllAccount } = accountActions;
  return {
    searchProjects: (params) => dispatch(searchProjects(params)),
    getAllAccount: () => dispatch(getAllAccount()),
  };
};

class ProjectHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount() {
    const { getAllAccount } = this.props;
    getAllAccount();
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
    } = this.state;

    const params = {
      project_id: projectId,
      task_name: taskName,
      start_date: { from: startDateFrom, to: startDateTo, order: orderStartDate },
      end_date: { from: endDateFrom, to: endDateTo, order: orderEndDate },
      extend: { from: extendFrom, to: extendTo, order: orderExtend },
      duration: { order: orderDuration },
      in_charge: inCharge,
      resources: selectedResources,
    };

    const { searchProjects } = this.props;
    searchProjects(params);
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
    } = this.state;

    switch (type) {
      case 'start':
        return {
          rangeStart: startDateFrom,
          rangeEnd: startDateTo,
          onChangeRangeStart: this.onChangeStartDateRangeS,
          onChangeRangeEnd: this.onChangeStartDateRangeE,
          order: orderStartDate,
        };
      case 'end':
        return {
          rangeStart: endDateFrom,
          rangeEnd: endDateTo,
          onChangeRangeStart: this.onChangeEndDateRangeS,
          onChangeRangeEnd: this.onChangeEndDateRangeE,
          order: orderEndDate,
        };
      case 'extend':
        return {
          rangeStart: extendFrom,
          rangeEnd: extendTo,
          onChangeRangeStart: this.onChangeExtendRangeS,
          onChangeRangeEnd: this.onChangeExtendRangeE,
          order: orderExtend,
        };
      default:
        return {};
    }
  }

  onClickResource = () => {
    const { searchByResourceVisible } = this.state;
    this.setState({ searchByResourceVisible: !searchByResourceVisible });
  }

  onClickName = () => {
    const { searchByNameVisible } = this.state;
    this.setState({ searchByNameVisible: !searchByNameVisible });
  }

  onClickDate = (event) => {
    const { type } = event.currentTarget.dataset;
    const { searchByDateVisible } = this.state;
    this.setState({ searchByDateVisible: !searchByDateVisible, dateType: type });
  }

  onClickDuration = () => {
    const { searchByDurationVisible } = this.state;
    this.setState({ searchByDurationVisible: !searchByDurationVisible });
  }

  onClickInCharge = () => {
    const { searchByUsersVisible } = this.state;
    this.setState({ searchByUsersVisible: !searchByUsersVisible });
  }

  onChangeOrder = async (event) => {
    const { by } = event.currentTarget.dataset;
    const order = event.target.value;

    switch (by) {
      case 'duration':
        await this.setState({
          orderDuration: order,
          orderStartDate: '',
          orderEndDate: '',
          orderExtend: '',
        });
        break;
      case 'start':
        await this.setState({
          orderDuration: '',
          orderStartDate: order,
          orderEndDate: '',
          orderExtend: '',
        });
        break;
      case 'end':
        await this.setState({
          orderDuration: '',
          orderStartDate: '',
          orderEndDate: order,
          orderExtend: '',
        });
        break;
      case 'extend':
        await this.setState({
          orderDuration: '',
          orderStartDate: '',
          orderEndDate: '',
          orderExtend: order,
        });
        break;
      default:
    }
    this.search();
  }

  onChangeProject = async (event) => {
    const projectId = event.target.value;
    await this.setState({ projectId });
    this.search();
  }

  onChangeTask = async (event) => {
    const taskName = event.target.value;
    await this.setState({ taskName });
    this.search();
  }

  onChangeStartDateRangeS = async (startDateFrom) => {
    await this.setState({ startDateFrom });
    this.search();
  }

  onChangeStartDateRangeE = async (startDateTo) => {
    await this.setState({ startDateTo });
    this.search();
  }

  onChangeEndDateRangeS = async (endDateFrom) => {
    await this.setState({ endDateFrom });
    this.search();
  }

  onChangeEndDateRangeE = async (endDateTo) => {
    this.setState({ endDateTo });
    this.search();
  }

  onChangeExtendRangeS = async (extendFrom) => {
    await this.setState({ extendFrom });
    this.search();
  }

  onChangeExtendRangeE = async (extendTo) => {
    await this.setState({ extendTo });
    this.search();
  }

  onClickAvatar = async (event) => {
    const { inCharge } = this.state;
    const inChargeCopy = inCharge;
    const { id } = event.currentTarget.dataset;
    const targetIndex = inCharge.indexOf(id);
    if (targetIndex === notExist) {
      inChargeCopy.push(id);
    } else {
      inChargeCopy.splice(targetIndex, 1);
    }
    await this.setState({ inCharge: inChargeCopy });
    this.search();
  }

  onClickResourceIcon = async (event) => {
    const { selectedResources } = this.state;
    const selectedResourcesCopy = selectedResources;
    const { id } = event.currentTarget.dataset;
    const targetIndex = selectedResources.indexOf(id);
    if (targetIndex === notExist) {
      selectedResourcesCopy.push(id);
    } else {
      selectedResourcesCopy.splice(targetIndex, 1);
    }
    await this.setState({ selectedResources: selectedResourcesCopy });
    this.search();
  }

  clearSearchName = async () => {
    await this.setState({
      taskName: '',
      projectId: '',
      searchByNameVisible: false,
    });
    this.search();
  }

  clearSearchStartDate = async () => {
    await this.setState({
      startDateFrom: '',
      startDateTo: '',
      orderStartDate: '',
      searchByDateVisible: false,
    });
    this.search();
  }

  clearSearchEndDate = async () => {
    await this.setState({
      endDateFrom: '',
      endDateTo: '',
      orderEndDate: '',
      searchByDateVisible: false,
    });
    this.search();
  }

  clearSearchExtend = async () => {
    await this.setState({
      extendFrom: '',
      extendTo: '',
      orderExtend: '',
      searchByDateVisible: false,
    });
    this.search();
  }

  clearSearchDuration = async () => {
    await this.setState({ orderDuration: '', searchByDurationVisible: false });
    this.search();
  }

  clearSearchInCharge = async () => {
    await this.setState({ inCharge: [], searchByUsersVisible: false });
    this.search();
  }

  closeAllModal = () => {
    this.setState({
      searchByNameVisible: false,
      searchByDateVisible: false,
      searchByDurationVisible: false,
      searchByUsersVisible: false,
      searchByResourceVisible: false,
    });
  }

  render() {
    const {
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
    } = this.state;

    const resourceIconClass = selectedResources.length === 0 ? 'resourceIcon' : 'resourceIcon--selected';
    const {
      rangeStart, rangeEnd, onChangeRangeStart, onChangeRangeEnd, order,
    } = this.sortingByDateRange(dateType);

    return (
      <div className="gantt-index-header">
        <div className="gantt-index-header__resource">
          <div className={resourceIconClass} onClick={this.onClickResource} />
        </div>
        <div className="gantt-index-header__name">
          {projectId === '' && taskName === ''
            ? <span className="gantt-index-header__label" onClick={this.onClickName}>タイトル</span>
            : (
              <div className="selected--title">
                <span className="selected__label" onClick={this.onClickName}>タイトル</span>
                <span className="selected__clear" onClick={this.clearSearchName}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__startDate">
          {startDateFrom === '' && startDateTo === '' && orderStartDate === ''
            ? <span className="gantt-index-header__label" data-type="start" onClick={this.onClickDate}>開始日</span>
            : (
              <div className="selected">
                <span className="selected__label" data-type="start" onClick={this.onClickDate}>開始日</span>
                <span className="selected__clear" onClick={this.clearSearchStartDate}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__endDate">
          {endDateFrom === '' && endDateTo === '' && orderEndDate === ''
            ? <span className="gantt-index-header__label" data-type="end" onClick={this.onClickDate}>終了日</span>
            : (
              <div className="selected">
                <span className="selected__label" data-type="end" onClick={this.onClickDate}>終了日</span>
                <span className="selected__clear" onClick={this.clearSearchEndDate}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__extend">
          {extendFrom === '' && extendTo === '' && orderExtend === ''
            ? <span className="gantt-index-header__label" data-type="extend" onClick={this.onClickDate}>延長</span>
            : (
              <div className="selected">
                <span className="selected__label" data-type="extend" onClick={this.onClickDate}>延長</span>
                <span className="selected__clear" onClick={this.clearSearchExtend}>×</span>
              </div>
            )}
        </div>

        <div className="gantt-index-header__duration">
          {orderDuration === ''
            ? <span className="gantt-index-header__label" onClick={this.onClickDuration}>期間</span>
            : (
              <div className="selected">
                <span className="selected__label" onClick={this.onClickDuration}>期間</span>
                <span className="selected__clear" onClick={this.clearSearchDuration}>×</span>
              </div>
            )}
        </div>
        <div className="gantt-index-header__inCharge">
          {inCharge.length === 0
            ? <span className="gantt-index-header__label" onClick={this.onClickInCharge}>担当</span>
            : (
              <div className="selected">
                <span className="selected__label" onClick={this.onClickInCharge}>担当</span>
                <span className="selected__clear" onClick={this.clearSearchInCharge}>×</span>
              </div>
            )}
        </div>
        {searchByResourceVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByResource
              selectedResources={selectedResources}
              onClickResource={this.onClickResourceIcon}
            />
          </div>
        )}
        {searchByNameVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByName
              projectId={projectId}
              onChangeProject={this.onChangeProject}
              taskName={taskName}
              onChangeTask={this.onChangeTask}
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
            />
          </div>
        )}
        {searchByDurationVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByDuration onChangeOrder={this.onChangeOrder} selected={orderDuration} />
          </div>
        )}
        {searchByUsersVisible && (
          <div className="overlay" onClick={this.closeAllModal}>
            <SearchByUsers inCharge={inCharge} onClickAvatar={this.onClickAvatar} />
          </div>
        )}
      </div>
    );
  }
}

const OrderBy = (props) => {
  const { onChangeOrder, by, selected } = props;
  const selections = [{ label: '昇順', value: 'ASC' }, { label: '降順', value: 'DESC' }];
  return (
    <select data-by={by} value={selected} onChange={onChangeOrder} className="search__order">
      <option key="default" value={null} aria-label="order" />
      {selections.map((selection) => (
        <option key={selection.label} value={selection.value}>{selection.label}</option>
      ))}
    </select>
  );
};

const SearchByDuration = (props) => {
  const { onChangeOrder, selected } = props;
  return (
    <div className="search--duration" onClick={stopPropagation}>
      <div className="search__label">並べ替え</div>
      <OrderBy by="duration" onChangeOrder={onChangeOrder} selected={selected} />
      <div className="search__divide" />
    </div>
  );
};

const SearchByDate = (props) => {
  const {
    rangeStart,
    rangeEnd,
    onChangeRangeStart,
    onChangeRangeEnd,
    dateType,
    onChangeOrder,
    order,
  } = props;

  const className = `search--${dateType}`;
  return (
    <div className={className} onClick={stopPropagation}>
      <div className="search__label">並べ替え</div>
      <OrderBy by={dateType} onChangeOrder={onChangeOrder} selected={order} />
      <div className="search__divide" />
      <div className="search__label">表示する期間を指定</div>
      <div className="search__dateWrapper">
        <DatePicker
          className="search__dateRange"
          dateFormat="yyyy/MM/dd"
          showWeekNumbers
          placeholderText="範囲の開始日"
          selected={rangeStart}
          onChange={onChangeRangeStart}
        />
        <DatePicker
          className="search__dateRange"
          dateFormat="yyyy/MM/dd"
          showWeekNumbers
          placeholderText="範囲の終了日"
          selected={rangeEnd}
          onChange={onChangeRangeEnd}
        />
      </div>
    </div>
  );
};

const SearchByName = connect(mapStateToProps)((props) => {
  const {
    projectId, projects, onChangeProject, taskName, onChangeTask,
  } = props;

  return (
    <div className="search--name" onClick={stopPropagation}>
      <div className="search__label">プロジェクトを選択</div>
      <select value={projectId} onChange={onChangeProject} className="search__project">
        <option key="default" value={null} aria-label="selectProject" />
        {projects.map((project) => (
          <option key={project.name} value={project.id}>{project.name}</option>
        ))}
      </select>
      <div className="search__divide" />
      <div className="search__label">タスク名で検索</div>
      <input type="text" className="search__task" value={taskName} onChange={onChangeTask} />
    </div>
  );
});

const SearchByUsers = connect(mapStateToProps)((props) => {
  const { users, inCharge, onClickAvatar } = props;
  return (
    <div className="search--user" onClick={stopPropagation}>
      <div className="search__label">担当で絞り込み</div>
      <div className="search__usersWrapper">
        {users.map((user) => {
          const targetIndex = inCharge.indexOf(String(user.id));
          return (
            <div key={user.id} className="avatar">
              <div data-id={user.id} onClick={onClickAvatar} className="avatar__wrapper">
                <img src={user.avatar} alt={user.name} className="avatar__image" />
                {targetIndex !== notExist && <div className="avatar__selected" />}
              </div>
              <div className="avatar__name">{user.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const SearchByResource = connect(mapStateToProps)((props) => {
  const { resources, selectedResources, onClickResource } = props;
  return (
    <div className="search--resource" onClick={stopPropagation}>
      <div className="search__label">リソースで絞り込み</div>
      <div className="search__resourceWrapper">
        {resources.map((resource) => {
          const targetIndex = selectedResources.indexOf(String(resource.id));
          return (
            <div key={resource.id} className="resource">
              <div data-id={resource.id} onClick={onClickResource} className="resource__wrapper">
                <div className="resource__icon" style={{ backgroundColor: resource.color }} />
                {targetIndex !== notExist && <div className="resource__selected" />}
              </div>
              <div className="resource__name">{resource.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHeader);
