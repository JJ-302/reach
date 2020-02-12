import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as taskActions from '../store/task/actions';
import * as projectActions from '../store/project/actions';
import Confirm from './Confirm';
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

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  handleDestroy = (event) => {
    event.stopPropagation();
    const { id } = event.currentTarget.dataset;
    const { deleteTask } = this.props;
    deleteTask(id);
  }

  onClick = (event) => {
    const { openTaskForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openTaskForm({ taskID: id });
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
    const { tasks, deleteButtonVisible } = this.props;
    const {
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    return (
      tasks.map((task) => {
        const className = task.percentComplete === 'progress' ? 'task' : 'task--complete';
        return (
          <div key={task.id} data-id={task.id} className={className} onClick={this.onClick}>
            <div className="task__icon">
              {deleteButtonVisible ? (
                <FontAwesomeIcon
                  data-id={task.id}
                  icon={['fas', 'minus-circle']}
                  className="task__delete"
                  onClick={this.handleDestroy}
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
      })
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);
