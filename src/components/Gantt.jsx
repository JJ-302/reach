import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import { WEEKS, DAYS } from '../store/schedule/types';
import ChartBar from './ChartBar';
import '../css/Project.scss';
import { START_DAY } from '../utils/ScheduleConfig';

const BASE_CHART_WIDTH = 45;

const mapStateToProps = (state) => {
  const { project, schedule } = state;
  return {
    projects: project.projects,
    scheduleType: schedule.scheduleType,
  };
};

const calcOffset = (task) => {
  const offset = Moment(task.startDate, 'YYYY/MM/DD').startOf('days').diff(START_DAY, 'days');

  return (offset) * BASE_CHART_WIDTH;
};

const calcOffsetForWeeks = (task) => {
  const offset = Math.ceil(
    Moment(task.startDate, 'YYYY/MM/DD').startOf('week').diff(START_DAY, 'weeks', true),
  );
  return offset * BASE_CHART_WIDTH;
};

const calcChartWidthForWeeks = (task) => {
  const end = task.extend || task.endDate;
  const startDate = Moment(task.startDate, 'YYYY/MM/DD').startOf('week');
  const endDate = Moment(end, 'YYYY/MM/DD').endOf('week');
  return Math.ceil(endDate.diff(startDate, 'weeks', true));
};

const isBefore = (task) => Moment(task.startDate, 'YYYY/MM/DD').isBefore(START_DAY);

const isBeforeForWeek = (task) => Moment(task.startDate, 'YYYY/MM/DD').isBefore(START_DAY.startOf('week'));


const Gantt = (props) => {
  const { projects, scheduleType } = props;
  return (
    projects.map((project) => (
      <div key={project.name} className="project">
        <div className="projectHeader" />
        {project.tasks && project.tasks.map((task) => {
          const offset = scheduleType === DAYS ? calcOffset(task) : calcOffsetForWeeks(task);
          let diff = scheduleType === DAYS ? task.duration : calcChartWidthForWeeks(task);

          if (isBefore(task) && scheduleType === DAYS) {
            diff -= START_DAY.diff(Moment(task.startDate, 'YYYY/MM/DD').startOf('days'), 'days', true);
          } else if (isBeforeForWeek(task) && scheduleType === WEEKS) {
            diff -= Math.ceil(START_DAY.diff(Moment(task.startDate, 'YYYY/MM/DD'), 'week', true));
          }

          if (scheduleType === DAYS) {
            diff += 1;
          }

          const chartWidth = BASE_CHART_WIDTH * diff;
          const className = task.percentComplete === 'progress' ? 'task' : 'task--complete';

          return (
            <div key={task.id} style={{ paddingLeft: offset }} className={className}>
              <ChartBar chartWidth={chartWidth} data={task} />
            </div>
          );
        })}
      </div>
    ))
  );
};

export default connect(mapStateToProps)(Gantt);
