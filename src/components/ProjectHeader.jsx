import React, { useReducer, useEffect } from 'react';
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

const ON_CLICK_RESOURCE = 'ON_CLICK_RESOURCE';
const ON_CLICK_NAME = 'ON_CLICK_NAME';
const ON_CLICK_START_DATE = 'ON_CLICK_START_DATE';
const ON_CLICK_END_DATE = 'ON_CLICK_END_DATE';
const ON_CLICK_EXTEND = 'ON_CLICK_EXTEND';
const ON_CLICK_DURATION = 'ON_CLICK_DURATION';
const ON_CLICK_IN_CHARGE = 'ON_CLICK_IN_CHARGE';
const ON_CHANGE_PROJECT = 'ON_CHANGE_PROJECT';
const ON_CHANGE_TASK_NAME = 'ON_CHANGE_TASK_NAME';
const ON_CHANGE_START_DATE_FROM = 'ON_CHANGE_START_DATE_FROM';
const ON_CHANGE_START_DATE_TO = 'ON_CHANGE_START_DATE_TO';
const ON_CHANGE_END_DATE_FROM = 'ON_CHANGE_END_DATE_FROM';
const ON_CHANGE_END_DATE_TO = 'ON_CHANGE_END_DATE_TO';
const ON_CHANGE_EXTEND_FROM = 'ON_CHANGE_EXTEND_FROM';
const ON_CHANGE_EXTEND_TO = 'ON_CHANGE_EXTEND_TO';
const SELECT_AVATAR = 'SELECT_AVATAR';
const SELECT_RESOURCE = 'SELECT_RESOURCE';
const CLEAR_NAME = 'CLEAR_NAME';
const CLEAR_START_DATE = 'CLEAR_START_DATE';
const CLEAR_END_DATE = 'CLEAR_END_DATE';
const CLEAR_EXTEND = 'CLEAR_EXTEND';
const CLEAR_DURATION = 'CLEAR_DURATION';
const CLEAR_IN_CHARGE = 'CLEAR_IN_CHARGE';
const ORDER_BY_START_DATE = 'ORDER_BY_START_DATE';
const ORDER_BY_END_DATE = 'ORDER_BY_END_DATE';
const ORDER_BY_EXTEND = 'ORDER_BY_EXTEND';
const ORDER_BY_DURATION = 'ORDER_BY_DURATION';

const initialProjectHeaderState = {
  searchByResourceVisible: false,
  searchByNameVisible: false,
  searchByStartDateVisible: false,
  searchByEndDateVisible: false,
  searchByExtendVisible: false,
  searchByDurationVisible: false,
  searchByUsersVisible: false,
  projectId: '',
  taskName: '',
  startDateFrom: '',
  startDateTo: '',
  endDateFrom: '',
  endDateTo: '',
  extendFrom: '',
  extendTo: '',
  inCharge: [],
  selectedResources: [],
  orderStartDate: '',
  orderEndDate: '',
  orderExtend: '',
  orderDuration: '',
};

const projectHeaderReducer = (state, action) => {
  switch (action.type) {
    case ON_CLICK_RESOURCE:
      return {
        ...state,
        searchByResourceVisible: !state.searchByResourceVisible,
      };
    case ON_CLICK_NAME:
      return {
        ...state,
        searchByNameVisible: !state.searchByNameVisible,
      };
    case ON_CLICK_START_DATE:
      return {
        ...state,
        searchByStartDateVisible: !state.searchByStartDateVisible,
      };
    case ON_CLICK_END_DATE:
      return {
        ...state,
        searchByEndDateVisible: !state.searchByEndDateVisible,
      };
    case ON_CLICK_EXTEND:
      return {
        ...state,
        searchByExtendVisible: !state.searchByExtendVisible,
      };
    case ON_CLICK_DURATION:
      return {
        ...state,
        searchByDurationVisible: !state.searchByDurationVisible,
      };
    case ON_CLICK_IN_CHARGE:
      return {
        ...state,
        searchByUsersVisible: !state.searchByUsersVisible,
      };
    case ON_CHANGE_PROJECT:
      return {
        ...state,
        projectId: action.value,
      };
    case ON_CHANGE_TASK_NAME:
      return {
        ...state,
        taskName: action.value,
      };
    case ON_CHANGE_START_DATE_FROM:
      return {
        ...state,
        startDateFrom: action.value,
      };
    case ON_CHANGE_START_DATE_TO:
      return {
        ...state,
        startDateTo: action.value,
      };
    case ON_CHANGE_END_DATE_FROM:
      return {
        ...state,
        endDateFrom: action.value,
      };
    case ON_CHANGE_END_DATE_TO:
      return {
        ...state,
        endDateTo: action.value,
      };
    case ON_CHANGE_EXTEND_FROM:
      return {
        ...state,
        extendFrom: action.value,
      };
    case ON_CHANGE_EXTEND_TO:
      return {
        ...state,
        extendTo: action.value,
      };
    case SELECT_AVATAR:
      return {
        ...state,
        inCharge: action.value,
      };
    case SELECT_RESOURCE:
      return {
        ...state,
        selectedResources: action.value,
      };
    case CLEAR_NAME:
      return {
        ...state,
        taskName: '',
        projectId: '',
      };
    case CLEAR_START_DATE:
      return {
        ...state,
        startDateFrom: '',
        startDateTo: '',
        orderStartDate: '',
      };
    case CLEAR_END_DATE:
      return {
        ...state,
        endDateFrom: '',
        endDateTo: '',
        orderEndDate: '',
      };
    case CLEAR_EXTEND:
      return {
        ...state,
        extendFrom: '',
        extendTo: '',
        orderExtend: '',
      };
    case CLEAR_DURATION:
      return {
        ...state,
        orderDuration: '',
      };
    case CLEAR_IN_CHARGE:
      return {
        ...state,
        inCharge: [],
      };
    case ORDER_BY_START_DATE:
      return {
        ...state,
        orderStartDate: action.value,
        orderEndDate: '',
        orderExtend: '',
        orderDuration: '',
      };
    case ORDER_BY_END_DATE:
      return {
        ...state,
        orderStartDate: '',
        orderEndDate: action.value,
        orderExtend: '',
        orderDuration: '',
      };
    case ORDER_BY_EXTEND:
      return {
        ...state,
        orderStartDate: '',
        orderEndDate: '',
        orderExtend: action.value,
        orderDuration: '',
      };
    case ORDER_BY_DURATION:
      return {
        ...state,
        orderStartDate: '',
        orderEndDate: '',
        orderExtend: '',
        orderDuration: action.value,
      };
    default:
      return state;
  }
};

const ProjectHeader = (props) => {
  const {
    getAllAccount,
    searchProjects,
  } = props;

  const [state, dispatch] = useReducer(projectHeaderReducer, initialProjectHeaderState);
  const {
    searchByNameVisible,
    searchByStartDateVisible,
    searchByEndDateVisible,
    searchByExtendVisible,
    searchByDurationVisible,
    searchByUsersVisible,
    searchByResourceVisible,
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
  } = state;

  useEffect(() => {
    getAllAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    searchProjects({
      project_id: projectId,
      task_name: taskName,
      start_date: { from: startDateFrom, to: startDateTo, order: orderStartDate },
      end_date: { from: endDateFrom, to: endDateTo, order: orderEndDate },
      extend: { from: extendFrom, to: extendTo, order: orderExtend },
      duration: { order: orderDuration },
      in_charge: inCharge,
      resources: selectedResources,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
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
    inCharge.length,
    selectedResources.length,
  ]);

  const onClickResource = () => {
    dispatch({ type: ON_CLICK_RESOURCE });
  };

  const onClickName = () => {
    dispatch({ type: ON_CLICK_NAME });
  };

  const onClickStartDate = () => {
    dispatch({ type: ON_CLICK_START_DATE });
  };

  const onClickEndDate = () => {
    dispatch({ type: ON_CLICK_END_DATE });
  };

  const onClickExtend = () => {
    dispatch({ type: ON_CLICK_EXTEND });
  };

  const onClickDuration = () => {
    dispatch({ type: ON_CLICK_DURATION });
  };

  const onClickInCharge = () => {
    dispatch({ type: ON_CLICK_IN_CHARGE });
  };

  const onChangeProject = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_PROJECT, value });
  };

  const onChangeTaskName = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_TASK_NAME, value });
  };

  const onChangeStartDateFrom = (value) => dispatch({ type: ON_CHANGE_START_DATE_FROM, value });

  const onChangeStartDateTo = (value) => dispatch({ type: ON_CHANGE_START_DATE_TO, value });

  const onChangeEndDateFrom = (value) => dispatch({ type: ON_CHANGE_END_DATE_FROM, value });

  const onChangeEndDateTo = (value) => dispatch({ type: ON_CHANGE_END_DATE_TO, value });

  const onChangeExtendFrom = (value) => dispatch({ type: ON_CHANGE_EXTEND_FROM, value });

  const onChangeExtendTo = (value) => dispatch({ type: ON_CHANGE_EXTEND_TO, value });

  const selectAvatar = (event) => {
    const inChargeCopy = inCharge;
    const { id } = event.currentTarget.dataset;
    const targetIndex = inCharge.indexOf(id);
    if (targetIndex === notExist) {
      inChargeCopy.push(id);
    } else {
      inChargeCopy.splice(targetIndex, 1);
    }
    dispatch({ type: SELECT_AVATAR, value: inChargeCopy });
  };

  const selectResource = (event) => {
    const selectedResourcesCopy = selectedResources;
    const { id } = event.currentTarget.dataset;
    const targetIndex = selectedResources.indexOf(id);
    if (targetIndex === notExist) {
      selectedResourcesCopy.push(id);
    } else {
      selectedResourcesCopy.splice(targetIndex, 1);
    }
    dispatch({ type: SELECT_RESOURCE, value: selectedResourcesCopy });
  };

  const clearName = () => dispatch({ type: CLEAR_NAME });

  const clearStartDate = () => dispatch({ type: CLEAR_START_DATE });

  const clearEndDate = () => dispatch({ type: CLEAR_END_DATE });

  const clearExtend = () => dispatch({ type: CLEAR_EXTEND });

  const clearDuration = () => dispatch({ type: CLEAR_DURATION });

  const clearInCharge = () => dispatch({ type: CLEAR_IN_CHARGE });

  const orderByStartDate = (event) => {
    const { value } = event.target;
    dispatch({ type: ORDER_BY_START_DATE, value });
  };

  const orderByEndDate = (event) => {
    const { value } = event.target;
    dispatch({ type: ORDER_BY_END_DATE, value });
  };

  const orderByExtend = (event) => {
    const { value } = event.target;
    dispatch({ type: ORDER_BY_EXTEND, value });
  };

  const orderByDuration = (event) => {
    const { value } = event.target;
    dispatch({ type: ORDER_BY_DURATION, value });
  };

  const resourceIconClass = selectedResources.length === 0 ? 'resourceIcon' : 'resourceIcon--selected';

  return (
    <div className="gantt-index-header">
      <div className="gantt-index-header__resource">
        <div className={resourceIconClass} onClick={onClickResource} />
      </div>
      <div className="gantt-index-header__name">
        {projectId === '' && taskName === ''
          ? <span className="gantt-index-header__label" onClick={onClickName}>タイトル</span>
          : (
            <div className="selected--title">
              <span className="selected__label" onClick={onClickName}>タイトル</span>
              <span className="selected__clear" onClick={clearName}>×</span>
            </div>
          )}
      </div>

      <div className="gantt-index-header__startDate">
        {startDateFrom === '' && startDateTo === '' && orderStartDate === ''
          ? <span className="gantt-index-header__label" data-type="start" onClick={onClickStartDate}>開始日</span>
          : (
            <div className="selected">
              <span className="selected__label" data-type="start" onClick={onClickStartDate}>開始日</span>
              <span className="selected__clear" onClick={clearStartDate}>×</span>
            </div>
          )}
      </div>

      <div className="gantt-index-header__endDate">
        {endDateFrom === '' && endDateTo === '' && orderEndDate === ''
          ? <span className="gantt-index-header__label" data-type="end" onClick={onClickEndDate}>終了日</span>
          : (
            <div className="selected">
              <span className="selected__label" data-type="end" onClick={onClickEndDate}>終了日</span>
              <span className="selected__clear" onClick={clearEndDate}>×</span>
            </div>
          )}
      </div>

      <div className="gantt-index-header__extend">
        {extendFrom === '' && extendTo === '' && orderExtend === ''
          ? <span className="gantt-index-header__label" data-type="extend" onClick={onClickExtend}>延長</span>
          : (
            <div className="selected">
              <span className="selected__label" data-type="extend" onClick={onClickExtend}>延長</span>
              <span className="selected__clear" onClick={clearExtend}>×</span>
            </div>
          )}
      </div>

      <div className="gantt-index-header__duration">
        {orderDuration === ''
          ? <span className="gantt-index-header__label" onClick={onClickDuration}>期間</span>
          : (
            <div className="selected">
              <span className="selected__label" onClick={onClickDuration}>期間</span>
              <span className="selected__clear" onClick={clearDuration}>×</span>
            </div>
          )}
      </div>
      <div className="gantt-index-header__inCharge">
        {inCharge.length === 0
          ? <span className="gantt-index-header__label" onClick={onClickInCharge}>担当</span>
          : (
            <div className="selected">
              <span className="selected__label" onClick={onClickInCharge}>担当</span>
              <span className="selected__clear" onClick={clearInCharge}>×</span>
            </div>
          )}
      </div>
      {searchByResourceVisible && (
        <div className="overlay" onClick={onClickResource}>
          <SearchByResource
            selectedResources={selectedResources}
            selectResource={selectResource}
          />
        </div>
      )}
      {searchByNameVisible && (
        <div className="overlay" onClick={onClickName}>
          <SearchByName
            projectId={projectId}
            onChangeProject={onChangeProject}
            taskName={taskName}
            onChangeTaskName={onChangeTaskName}
          />
        </div>
      )}
      {searchByStartDateVisible && (
        <div className="overlay" onClick={onClickStartDate}>
          <SearchByDate
            dateType="start"
            rangeStart={startDateFrom}
            rangeEnd={startDateTo}
            onChangeRangeStart={onChangeStartDateFrom}
            onChangeRangeEnd={onChangeStartDateTo}
            onChangeOrder={orderByStartDate}
            order={orderStartDate}
          />
        </div>
      )}
      {searchByEndDateVisible && (
        <div className="overlay" onClick={onClickEndDate}>
          <SearchByDate
            dateType="end"
            rangeStart={endDateFrom}
            rangeEnd={endDateTo}
            onChangeRangeStart={onChangeEndDateFrom}
            onChangeRangeEnd={onChangeEndDateTo}
            onChangeOrder={orderByEndDate}
            order={orderEndDate}
          />
        </div>
      )}
      {searchByExtendVisible && (
        <div className="overlay" onClick={onClickExtend}>
          <SearchByDate
            dateType="extend"
            rangeStart={extendFrom}
            rangeEnd={extendTo}
            onChangeRangeStart={onChangeExtendFrom}
            onChangeRangeEnd={onChangeExtendTo}
            onChangeOrder={orderByExtend}
            order={orderExtend}
          />
        </div>
      )}
      {searchByDurationVisible && (
        <div className="overlay" onClick={onClickDuration}>
          <SearchByDuration onChangeOrder={orderByDuration} order={orderDuration} />
        </div>
      )}
      {searchByUsersVisible && (
        <div className="overlay" onClick={onClickInCharge}>
          <SearchByUsers inCharge={inCharge} selectAvatar={selectAvatar} />
        </div>
      )}
    </div>
  );
};

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
  const { onChangeOrder, order } = props;
  return (
    <div className="search--duration" onClick={stopPropagation}>
      <div className="search__label">並べ替え</div>
      <OrderBy onChangeOrder={onChangeOrder} order={order} />
      <div className="search__divide" />
    </div>
  );
};

const SearchByDate = (props) => {
  const {
    dateType,
    rangeStart,
    rangeEnd,
    onChangeRangeStart,
    onChangeRangeEnd,
    onChangeOrder,
    order,
  } = props;

  const className = `search--${dateType}`;
  return (
    <div className={className} onClick={stopPropagation}>
      <div className="search__label">並べ替え</div>
      <OrderBy onChangeOrder={onChangeOrder} order={order} />
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
    projectId, projects, onChangeProject, taskName, onChangeTaskName,
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
      <input type="text" className="search__task" value={taskName} onChange={onChangeTaskName} />
    </div>
  );
});

const SearchByUsers = connect(mapStateToProps)((props) => {
  const { users, inCharge, selectAvatar } = props;
  return (
    <div className="search--user" onClick={stopPropagation}>
      <div className="search__label">担当で絞り込み</div>
      <div className="search__usersWrapper">
        {users.map((user) => {
          const targetIndex = inCharge.indexOf(String(user.id));
          return (
            <div key={user.id} className="avatar">
              <div data-id={user.id} onClick={selectAvatar} className="avatar__wrapper">
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
  const { resources, selectedResources, selectResource } = props;
  return (
    <div className="search--resource" onClick={stopPropagation}>
      <div className="search__label">リソースで絞り込み</div>
      <div className="search__resourceWrapper">
        {resources.map((resource) => {
          const targetIndex = selectedResources.indexOf(String(resource.id));
          return (
            <div key={resource.id} className="resource">
              <div data-id={resource.id} onClick={selectResource} className="resource__wrapper">
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
