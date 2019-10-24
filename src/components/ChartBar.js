import React, { Component } from 'react'

import '../css/ChartBar.scss'

export default class ChartBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHover: false,
      offsetX: 0,
      offsetY: 0,
    }
  }

  onMouseEnter = (event) => {
    const offsetX = event.clientX + 30
    const offsetY = event.clientY
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
        style={{ width: chartWidth }}
        className="chartbar"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {isHover && <Window data={data} offsetX={offsetX} offsetY={offsetY} />}
      </div>
    )
  }
}

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
      <div className="windowRow__label">InCharge:</div>
      <div className="window__member" />
    </div>
  </div>
)