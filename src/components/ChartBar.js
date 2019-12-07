import React, { PureComponent } from 'react'

import '../css/ChartBar.scss'

export default class ChartBar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isHover: false,
      offsetX: 0,
      offsetY: 0,
    }
  }

  onMouseEnter = (event) => {
    const isOverflowX = window.innerWidth < (event.clientX + 300)
    const isOverflowY = window.innerHeight < (event.clientY + 300)
    const offsetX = isOverflowX ? event.clientX - 230 : event.clientX
    const offsetY = isOverflowY ? event.clientY - 150 : event.clientY
    this.setState({ isHover: true, offsetX, offsetY })
  }

  onMouseLeave = () => this.setState({ isHover: false })

  render() {
    const { chartWidth, data } = this.props
    const { isHover, offsetX, offsetY } = this.state
    return (
      <div
        style={{ width: chartWidth, backgroundColor: data.resource.color }}
        className="chartbar"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {isHover && <Window data={data} offsetX={offsetX} offsetY={offsetY} />}
      </div>
    )
  }
}

const Members = ({ users }) => (
  users.map((user) => <div key={user.name} className="windowMembers__name">{user.name}</div>)
)

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
)
