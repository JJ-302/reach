import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as taskActions from '../store/task/actions';
import * as projectActions from '../store/project/actions';
import '../css/Task.scss';

const mapStateToProps = (state) => {
  const { task } = state;
  return {
    deleteButtonVisible: task.deleteButtonVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openTaskForm } = taskActions;
  const { deleteTask } = projectActions;
  return {
    openTaskForm: ({ taskID }) => dispatch(openTaskForm({ taskID })),
    deleteTask: (id) => dispatch(deleteTask(id)),
  };
};

const Avatars = ({ members }) => (
  members.map((member, i) => {
    if (i > 3) {
      return null;
    }
    if (i < 3) {
      return <img key={member.name} src={member.avatar} alt={member.name} className="task__avatar" />;
    }
    return <div key={String(i)} className="task__avatar--length">{members.length}</div>;
  })
);

const Task = (props) => {
  const { tasks, deleteButtonVisible } = props;
  const handleDestroy = (event) => {
    event.stopPropagation();
    const { id } = event.currentTarget.dataset;
    const { deleteTask } = props;
    deleteTask(id);
  };

  const onClick = (event) => {
    const { openTaskForm } = props;
    const { id } = event.currentTarget.dataset;
    openTaskForm({ taskID: id });
  };

  return (
    tasks.map((task) => {
      const className = task.percentComplete === 'progress' ? 'task' : 'task--complete';
      return (
        <div key={task.id} data-id={task.id} className={className} onClick={onClick}>
          <div className="task__icon">
            {deleteButtonVisible ? (
              <FontAwesomeIcon
                data-id={task.id}
                icon={['fas', 'minus-circle']}
                className="task__delete"
                onClick={handleDestroy}
              />
            ) : <div className="task__resource" style={{ backgroundColor: task.resource.color }} />}
          </div>
          <div className="task__name">{task.name}</div>
          <div className="task__startDate">{task.startDate}</div>
          <div className="task__endDate">{task.endDate}</div>
          <div className="task__extend">{task.extend}</div>
          <div className="task__duration">{task.duration}</div>
          <div className="task__inCharge">
            <Avatars members={task.users} />
          </div>
        </div>
      );
    })
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);
