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
    const offsetX = isOverflowX ? event.clientX - 280 : event.clientX + 30
    const offsetY = isOverflowY ? event.clientY - 150 : event.clientY
    this.setState({ isHover: true, offsetX, offsetY })
  }

  onMouseLeave = () => {
    this.setState({ isHover: false })
  }

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
      <div className="windowRow__label">Name:</div>
      <div className="windowRow__name">{data.name}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">StartDate:</div>
      <div className="window__startDate">{data.startDate}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">EndDate:</div>
      <div className="window__endDate">{data.endDate}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">Extend:</div>
      <div className="window__extend">{data.extend}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">Duration:</div>
      <div className="window__duration">{data.duration}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">Progress:</div>
      <div className="window__progress">{data.percentComplete}</div>
    </div>
    <div className="windowRow">
      <div className="windowRow__label">InCharge:</div>
      <div className="windowMembers">
        <Members users={data.users} />
      </div>
    </div>
    <div className="windowCol">
      <div className="windowCol__label">Description:</div>
      <div className="windowCol__description">{data.description}</div>
    </div>
  </div>
)
