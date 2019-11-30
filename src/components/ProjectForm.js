import React, { PureComponent } from 'react'

import Utils from '../Utils'
import Confirm from './Confirm'
import ErrorMessage from './Error'
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
    }
  }

  componentDidMount() {
    if (this.action === 'edit') {
      this.editProjectFormValue()
    }
  }

  editProjectFormValue = () => {
    const { id } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}/edit`)
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_authenticated, project }) => {
        if (is_authenticated) {
          const { name, description } = project
          this.setState({ name, description })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  handleCreate = () => {
    const { name, description } = this.state
    const { id } = this.props
    const request = Utils.preparingRequest(this.action, id, 'projects')
    if (request === null) {
      return
    }
    const url = Utils.buildRequestUrl(request.uriPattern)
    const params = { name, description }

    fetch(url, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', 'X-Reach-token': this.token },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_created, errors, project } = res
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
      })
      .catch(() => {
        // TODO
      })
  }

  handleDestroy = () => {
    const { id, refreshProject } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}`)
    fetch(url, {
      method: 'DELETE',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_delete, project }) => {
        if (is_delete) {
          refreshProject(project, 'destroy')
        }
      })
      .catch(() => {
        // TODO
      })
  }

  openConfirm = () => this.setState({ confirmVisible: true })

  closeConfirm = () => this.setState({ confirmVisible: false })

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onChangeDescription = (event) => {
    const description = event.target.value
    this.setState({ description })
  }

  onClickOverlay = (event) => {
    event.stopPropagation()
  }

  render() {
    const { closeModal } = this.props
    const {
      name,
      description,
      errors,
      confirmVisible,
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
            placeholder="Type a project name"
            value={name}
            onChange={this.onChangeName}
          />
          <textarea
            className="modalForm__textarea"
            placeholder="Type a project description"
            value={description}
            onChange={this.onChangeDescription}
          />
          <button type="button" onClick={this.handleCreate} className="modalForm__button">
            {title}
          </button>
          {this.action === 'edit' && (
            <button type="button" onClick={this.openConfirm} className="modalForm__button--delete">
              Delete Project
            </button>
          )}
        </div>
        {confirmVisible && (
          <Confirm
            type="ask"
            closeConfirm={this.closeConfirm}
            title="Project destroy"
            description="Are you sure?"
            confirm={this.handleDestroy}
          />
        )}
      </div>
    )
  }
}
