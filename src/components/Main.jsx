import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import { WEEKS, DAYS } from '../store/schedule/types';
import * as scheduleActions from '../store/schedule/actions';
import SideBar from './SideBar';
import ProjectHeader from './ProjectHeader';
import Project from './Project';
import Resource from './Resource';
import Gantt from './Gantt';
import '../css/Main.scss';
import {
  START_DAY, END_DAY, SUN, SAT,
} from '../utils/ScheduleConfig';

const mapStateToProps = (state) => {
  const { schedule } = state;
  return {
    scheduleType: schedule.scheduleType,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { changeToWeeks, changeToDays } = scheduleActions;
  return {
    changeToWeeks: () => dispatch(changeToWeeks()),
    changeToDays: () => dispatch(changeToDays()),
  };
};

const modifireForDays = (day) => {
  switch (day.get('day')) {
    case SUN:
      return '--sun';
    case SAT:
      return '--sat';
    default:
      return '';
  }
};

const scheduleAttr = (day, scheduleType) => {
  const attr = {};
  if (scheduleType === DAYS) {
    attr.formatDate = day.format('MMM D');
    attr.className = `gantt-schedule-header__date${modifireForDays(day)}`;
  } else {
    const startOfWeek = day.startOf('week');
    attr.formatDate = `W${day.format('W')} ${startOfWeek.format('M/D')}`;
    attr.className = 'gantt-schedule-header__week';
  }
  return attr;
};

const Schedule = connect(mapStateToProps)((props) => {
  const { scheduleType } = props;
  const schedules = [];
  for (let day = Moment(START_DAY); day <= END_DAY; day.add(1, scheduleType)) {
    const attr = scheduleAttr(day, scheduleType);
    schedules.push(
      <div className={attr.className} key={day.format('YYYYMMDD')}>
        {attr.formatDate}
      </div>,
    );
  }
  return schedules;
});

const Header = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const { scheduleType, changeToWeeks, changeToDays } = props;
  const className = { weeks: 'switchView__button', days: 'switchView__button' };
  if (scheduleType === WEEKS) {
    className.weeks += '--disable';
  } else if (scheduleType === DAYS) {
    className.days += '--disable';
  }

  return (
    <div className="header">
      <div className="switchView">
        <div className={className.weeks} onClick={changeToWeeks}>Week</div>
        <div className="switchView__divider">|</div>
        <div className={className.days} onClick={changeToDays}>Day</div>
      </div>
      <Resource />
    </div>
  );
});

const Main = () => (
  <div className="App">
    <SideBar />
    <div className="mainContainer">
      <Header />
      <div className="gantt">
        <div className="gantt-index">
          <ProjectHeader />
          <Project />
        </div>
        <div className="gantt-schedule">
          <div className="gantt-schedule-header">
            <Schedule />
          </div>
          <Gantt />
        </div>
      </div>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
