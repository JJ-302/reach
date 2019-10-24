import React, { Component } from 'react'

import '../css/Form.scss'

export default class ProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name,
      description: props.description,
    }
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
    const { name, description } = this.state
    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {action}
            Project
          </div>
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
          <button type="button" onClick={closeModal} className="modalForm__button">
            {action}
          </button>
        </div>
      </div>
    )
  }
}
