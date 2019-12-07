import React, { PureComponent } from 'react'

import Confirm from './Confirm'
import ErrorMessage from './Error'
import Utils from '../utils/Utils'
import {
  badRequest,
  checkParams,
  reload,
  serverError,
  ask,
  destroy,
} from '../utils/Text'

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
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
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
        } else {
          this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
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
        } else {
          this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
      })
  }

  handleCreate = () => {
    const { id, closeModal, refresh } = this.props
    const { pickedColor, name } = this.state
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
      .then(({ errors, is_created, resource }) => {
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
        this.openConfirm('error', serverError, reload, this.closeConfirm)
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
        } else {
          this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
        }
      })
      .catch(() => {
        this.openConfirm('error', serverError, reload, this.closeConfirm)
      })
  }

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    })
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

  onPickColor = (event) => {
    const pickedColor = event.target.dataset.color
    this.setState({ pickedColor })
  }

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const title = this.action === 'new' ? 'Create ' : 'Update '
    const { closeModal } = this.props
    const {
      name,
      colors,
      pickedColor,
      errors,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
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
            placeholder="リソース名を入力"
            value={name}
            onChange={this.onChangeName}
          />
          <div className="modalForm__label">ラベルの色を選択</div>
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
            <button
              type="button"
              onClick={() => this.openConfirm('ask', `Project ${destroy}`, ask, this.handleDestroy)}
              className="modalForm__button--delete"
            >
              Delete Resource
            </button>
          )}
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
