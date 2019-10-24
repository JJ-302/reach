import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ProjectForm from './ProjectForm'
import ResourceForm from './ResourceForm'
import '../css/SideBar.scss'

export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      formType: '',
    }
  }

  openModal = (formType) => {
    this.setState({ modalVisible: true, formType })
  }

  closeModal = () => {
    this.setState({ modalVisible: false })
  }

  render() {
    const { modalVisible, formType } = this.state
    return (
      <div className="sidebar">
        <FontAwesomeIcon
          icon={['fas', 'plus']}
          className="sidebar__icon"
          onClick={() => this.openModal('project')}
        />
        <FontAwesomeIcon
          icon={['fas', 'tags']}
          className="sidebar__icon"
          onClick={() => this.openModal('resource')}
        />
        {modalVisible && <Form formType={formType} closeModal={this.closeModal} />}
      </div>
    )
  }
}

const Form = (props) => {
  const { formType, closeModal } = props
  switch (formType) {
    case 'project':
      return <ProjectForm action="Create" closeModal={closeModal} />
    case 'resource':
      return <ResourceForm action="Create" closeModal={closeModal} />
    default:
      return null
  }
}
