import React, { Component } from 'react'

import Utils from '../Utils'
import ErrorMessage from './Error'

export default class ResourceForm extends Component {
  constructor(props) {
    super(props)
    this.getIndexColors()
    this.state = {
      name: '',
      token: '',
      colors: [],
      pickedColor: '',
      errors: [],
    }
  }

  getIndexColors = () => {
    const token = localStorage.getItem('token')
    const url = Utils.buildRequestUrl('/colors')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': token },
    })
      .then((_res) => _res.json())
      .then((res) => {
        if (res.is_authenticated) {
          this.setState({ colors: res.colors, token })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  handleCreate = () => {
    const { closeModal } = this.props
    const { pickedColor, token, name } = this.state
    const params = { name, color_id: pickedColor }
    const url = Utils.buildRequestUrl('/resources')
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Reach-token': token },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { errors, is_created } = res
        if (is_created) {
          closeModal()
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        // TODO
      })
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
    const {
      name,
      colors,
      pickedColor,
      errors,
    } = this.state

    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {action}
            Resource
          </div>
          {errors.length !== 0 && <ErrorMessage action="Resource creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="Type a resource name"
            value={name}
            onChange={this.onChangeName}
          />
          <div className="modalForm__label">Chart color</div>
          <div className="colorPallet">
            <ColorPallets
              colors={colors}
              pickedColor={pickedColor}
              onPickColor={this.onPickColor}
            />
          </div>
          <button type="button" onClick={this.handleCreate} className="modalForm__button">
            {action}
          </button>
        </div>
      </div>
    )
  }
}

const ColorPallets = ({ colors, pickedColor, onPickColor }) => {
  const colorPallets = colors.map((color) => {
    const modifier = pickedColor === String(color.id) ? '--selected' : ''
    const className = `colorPallet__body${modifier}`
    return (
      <div key={color.id} className="colorPallet__edge">
        <div
          className={className}
          style={{ backgroundColor: color.value }}
          data-color={color.id}
          onClick={onPickColor}
        />
      </div>
    )
  })
  return colorPallets
}
