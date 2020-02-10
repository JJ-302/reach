import React, { PureComponent } from 'react';
import Moment from 'moment';

import SideBar from './SideBar';
import ProjectHeader from './ProjectHeader';
import Project from './Project';
import Resource from './Resource';
import Gantt from './Gantt';
import Confirm from './Confirm';
import '../css/Main.scss';

import Utils from '../utils/Utils';

const sun = 0;
const sat = 6;
const startDate = Moment(new Date()).subtract(2, 'weeks');
const endDate = Utils.dateRangeEnd();


const whatDayIsToday = (day) => {
  switch (day.get('day')) {
    case sun:
      return '--sun';
    case sat:
      return '--sat';
    default:
      return '';
  }
};

const scheduleAttr = (day, scheduleType) => {
  const attr = {};
  if (scheduleType === 'days') {
    attr.formatDate = day.format('MMM D');
    attr.className = `gantt-schedule-header__date${whatDayIsToday(day)}`;
  } else {
    const startOfWeek = day.startOf('week');
    attr.formatDate = `W${day.format('W')} ${startOfWeek.format('M/D')}`;
    attr.className = 'gantt-schedule-header__week';
  }
  return attr;
};

const Schedule = ({ scheduleType }) => {
  const schedules = [];
  for (let day = Moment(startDate); day <= endDate; day.add(1, scheduleType)) {
    const attr = scheduleAttr(day, scheduleType);
    schedules.push(
      <div className={attr.className} key={day.format('YYYYMMDD')}>
        {attr.formatDate}
      </div>,
    );
  }
  return schedules;
};

const Header = (props) => {
  const { scheduleType, onClick } = props;
  const className = { weeks: 'switchView__button', days: 'switchView__button' };
  if (scheduleType === 'weeks') {
    className.weeks += '--disable';
  } else if (scheduleType === 'days') {
    className.days += '--disable';
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
      <Resource />
    </div>
  );
};

class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'weeks',
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  changeScheduleType = (event) => {
    const { type } = event.target.dataset;
    this.setState({ type });
  }

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    });
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

  render() {
    const {
      type,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    return (
      <div className="App">
        <SideBar />
        <div className="mainContainer">
          <Header scheduleType={type} onClick={this.changeScheduleType} />
          <div className="gantt">
            <div className="gantt-index">
              <ProjectHeader />
              <Project />
            </div>
            <div className="gantt-schedule">
              <div className="gantt-schedule-header">
                <Schedule scheduleType={type} />
              </div>
              <Gantt scheduleType={type} />
            </div>
          </div>
        </div>
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
    );
  }
}

export default Main;
