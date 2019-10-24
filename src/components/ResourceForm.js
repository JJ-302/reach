import React, { Component } from 'react'

import colors from '../TemporalyColors'

export default class ResourceForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      pickedColor: '',
    }
  }

  onPickColor = (event) => {
    const pickedColor = event.target.dataset.color
    this.setState({ pickedColor })
  }

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onClickOverlay = (event) => {
    event.stopPropagation()
  }

  render() {
    const { closeModal, action } = this.props
    const { name, pickedColor } = this.state
    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {action}
            Resource
          </div>
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="Type a resource name"
            value={name}
            onChange={this.onChangeName}
          />
          <div className="modalForm__label">Chart color</div>
          <div className="colorPallet">
            <ColorPallets pickedColor={pickedColor} onPickColor={this.onPickColor} />
          </div>
          <button type="button" onClick={closeModal} className="modalForm__button">
            {action}
          </button>
        </div>
      </div>
    )
  }
}

const ColorPallets = ({ pickedColor, onPickColor }) => {
  const colorPallets = colors.map((color) => {
    const modifier = pickedColor === color.name ? '--selected' : ''
    const className = `colorPallet__body${modifier}`
    return (
      <div key={color.name} className="colorPallet__edge">
        <div
          className={className}
          style={{ backgroundColor: color.val }}
          data-color={color.name}
          onClick={onPickColor}
        />
      </div>
    )
  })
  return colorPallets
}
