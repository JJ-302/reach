import React, { PureComponent } from 'react'

import Utils from '../utils/Utils'
import Confirm from './Confirm'
import ErrorMessage from './Error'
import {
  badRequest,
  checkParams,
  reload,
  serverError,
  ask,
  destroy,
} from '../utils/Text'

import '../css/Form.scss'

export default class ProjectForm extends PureComponent {
  constructor(props) {
    super(props)
    this.token = localStorage.getItem('token')
    const { action } = this.props
    this.action = action
    this.state = {
      name: '',
      description: '',
      errors: [],
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    }
  }

  componentDidMount() {
    if (this.action === 'edit') {
      this.editProjectFormValue()
    }
  }

  editProjectFormValue = async () => {
    const { id } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}/edit`)
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm)
    })

    const { is_authenticated, project } = await response.json()
    if (is_authenticated) {
      const { name, description } = project
      this.setState({ name, description })
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
    }
  }

  handleCreate = async () => {
    const { name, description } = this.state
    const { id } = this.props
    const request = Utils.preparingRequest(this.action, id, 'projects')
    if (request === null) {
      return
    }
    const url = Utils.buildRequestUrl(request.uriPattern)
    const params = { name, description }

    const response = await fetch(url, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', 'X-Reach-token': this.token },
      body: JSON.stringify(params),
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm)
    })

    const { is_created, errors, project } = await response.json()
    const { closeModal, refresh } = this.props
    if (is_created && this.action === 'new') {
      refresh(project, 'new')
      closeModal()
    } else if (is_created && this.action === 'edit') {
      refresh(project.name)
      closeModal()
    } else {
      this.setState({ errors })
    }
  }

  handleDestroy = async () => {
    const { id, refreshProject } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}`)
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm)
    })

    const { is_delete, project } = await response.json()
    if (is_delete) {
      refreshProject(project, 'destroy')
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm)
    }
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

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onChangeDescription = (event) => {
    const description = event.target.value
    this.setState({ description })
  }

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const { closeModal } = this.props
    const {
      name,
      description,
      errors,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state

    const title = this.action === 'new' ? 'Create ' : 'Update '
    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {title}
            Project
          </div>
          {errors.length !== 0 && <ErrorMessage action="Project creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="プロジェクト名を入力"
            value={name}
            onChange={this.onChangeName}
          />
          <textarea
            className="modalForm__textarea"
            placeholder="プロジェクトの説明を入力"
            value={description}
            onChange={this.onChangeDescription}
          />
          <button type="button" onClick={this.handleCreate} className="modalForm__button">
            {title}
          </button>
          {this.action === 'edit' && (
            <button
              type="button"
              onClick={() => this.openConfirm('ask', `Project ${destroy}`, ask, this.handleDestroy)}
              className="modalForm__button--delete"
            >
              Delete Project
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
