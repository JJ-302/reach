import React, { Component } from 'react'

import Utils from '../Utils'
import ErrorMessage from './Error'
import '../css/Form.scss'

export default class ProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      errors: [],
    }
  }

  handleCreate = () => {
    const { name, description } = this.state
    const url = Utils.buildRequestUrl('/projects')
    const token = localStorage.getItem('token')
    const params = { name, description }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Reach-token': token },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_created, errors, project } = res
        if (is_created) {
          const { closeModal, refresh } = this.props
          refresh(project)
          closeModal()
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        // TODO
      })
  }

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
    const { closeModal, action } = this.props
    const { name, description, errors } = this.state
    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {action}
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
            {action}
          </button>
        </div>
      </div>
    )
  }
}
