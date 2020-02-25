import React, { useReducer } from 'react';

import '../css/ChartBar.scss';

const MOUSE_ENTER = 'MOUSE_ENTER';
const MOUSE_LEAVE = 'MOUSE_LEAVE';

const initialChatBarState = { isHover: false, offsetX: 0, offsetY: 0 };

const chartBarReducer = (state, action) => {
  switch (action.type) {
    case MOUSE_ENTER: {
      const { clientX, clientY } = action.payload;
      const isOverflowX = window.innerWidth < (clientX + 300);
      const isOverflowY = window.innerHeight < (clientY + 300);
      const offsetX = isOverflowX ? clientX - 230 : clientX;
      const offsetY = isOverflowY ? clientY - 150 : clientY;
      return { isHover: true, offsetX, offsetY };
    }
    case MOUSE_LEAVE:
      return { ...state, isHover: false };
    default:
      return state;
  }
};

const ChartBar = (props) => {
  const { chartWidth, data } = props;
  const [state, dispatch] = useReducer(chartBarReducer, initialChatBarState);
  const { isHover, offsetX, offsetY } = state;

  const onMouseEnter = (event) => {
    dispatch({ type: MOUSE_ENTER, payload: { clientX: event.clientX, clientY: event.clientY } });
  };

  const onMouseLeave = () => dispatch({ type: MOUSE_LEAVE });

  return (
    <div
      style={{ width: chartWidth, backgroundColor: data.resource.color }}
      className="chartbar"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isHover && <Window data={data} offsetX={offsetX} offsetY={offsetY} />}
    </div>
  );
};

const Members = ({ users }) => (
  users.map((user) => <div key={user.name} className="windowMembers__name">{user.name}</div>)
);

const Window = ({ data, offsetX, offsetY }) => (
  <div className="window" style={{ top: offsetY, left: offsetX }}>
    <div className="windowRow">
      <div className="windowRow__label">タイトル:</div>
      <div className="windowRow__name">{data.name}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">開始日:</div>
      <div className="window__startDate">{data.startDate}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">終了日:</div>
      <div className="window__endDate">{data.endDate}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">延長:</div>
      <div className="window__extend">{data.extend}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">期間:</div>
      <div className="window__duration">{data.duration}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">進捗:</div>
      <div className="window__progress">{data.percentComplete}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">担当:</div>
      <div className="windowMembers">
        <Members users={data.users} />
      </div>
    </div>
    <div className="windowCol">
      <div className="windowCol__label">説明:</div>
      <div className="windowCol__description">{data.description}</div>
    </div>
  </div>
);

export default ChartBar;
