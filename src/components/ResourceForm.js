import React, { PureComponent } from 'react'

import Confirm from './Confirm'
import Utils from '../utils/Utils'
import ErrorMessage from './Error'

export default class ResourceForm extends PureComponent {
  constructor(props) {
    super(props)
    const { action } = this.props
    this.action = action
    this.state = {
      name: '',
      colors: [],
      pickedColor: '',
      errors: [],
      confirmVisible: false,
    }
  }

  async componentDidMount() {
    this.token = await localStorage.getItem('token')
    this.getIndexColors()
    if (this.action === 'edit') {
      this.editResourceFormValue()
    }
  }

  getIndexColors = () => {
    const url = Utils.buildRequestUrl('/colors')
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_authenticated, colors }) => {
        if (is_authenticated) {
          this.setState({ colors })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  editResourceFormValue = () => {
    const { id } = this.props
    const url = Utils.buildRequestUrl(`/resources/${id}/edit`)
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_authenticated, resource }) => {
        if (is_authenticated) {
          this.setState({ name: resource.name, pickedColor: String(resource.color_id) })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  handleCreate = () => {
    const { closeModal, refresh } = this.props
    const { pickedColor, name } = this.state
    const { id } = this.props
    const request = Utils.preparingRequest(this.action, id, 'resources')
    if (request === null) {
      return
    }
    const url = Utils.buildRequestUrl(request.uriPattern)
    const params = { name, color_id: pickedColor }
    fetch(url, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', 'X-Reach-token': this.token },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { errors, is_created, resource } = res
        if (is_created && this.action === 'new') {
          refresh(resource)
          closeModal()
        } else if (is_created && this.action === 'edit') {
          refresh()
          closeModal()
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  handleDestroy = () => {
    const { id, refresh } = this.props
    const url = Utils.buildRequestUrl(`/resources/${id}`)
    fetch(url, {
      method: 'DELETE',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_delete }) => {
        if (is_delete) {
          refresh()
        }
      })
      .catch(() => {
        // TODO
      })
  }

  openConfirm = () => this.setState({ confirmVisible: true })

  closeConfirm = () => this.setState({ confirmVisible: false })

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
    const title = this.action === 'new' ? 'Create ' : 'Update '
    const { closeModal } = this.props
    const {
      name,
      colors,
      pickedColor,
      errors,
      confirmVisible,
    } = this.state

    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {title}
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
            {title}
          </button>
          {this.action === 'edit' && (
            <button type="button" onClick={this.openConfirm} className="modalForm__button--delete">
              Delete Resource
            </button>
          )}
        </div>
        {confirmVisible && (
          <Confirm
            type="ask"
            closeConfirm={this.closeConfirm}
            title="Resource destroy"
            description="Are you sure?"
            confirm={this.handleDestroy}
          />
        )}
      </div>
    )
  }
}

const ColorPallets = ({ colors, pickedColor, onPickColor }) => (
  colors.map((color) => {
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
)
