import React, { Component } from 'react'

import ResourceForm from './ResourceForm'

export default class Resource extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resourceFormVisible: false,
    }
  }

  toggleResourceForm = () => {
    const { resourceFormVisible } = this.state
    this.setState({ resourceFormVisible: !resourceFormVisible })
  }

  render() {
    const { resourceFormVisible } = this.state
    const { resource, refresh } = this.props

    return (
      <div className="resource__wrapper" onClick={this.toggleResourceForm}>
        <div className="resource__icon" style={{ backgroundColor: resource.color }} />
        <div className="resource__name">{resource.name}</div>
        {resourceFormVisible
          && (
            <ResourceForm
              id={resource.id}
              action="edit"
              refresh={refresh}
              closeModal={this.toggleResourceForm}
            />
          )}
      </div>
    )
  }
}
