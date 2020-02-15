import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as attachmentAction from '../store/attachment/actions';
import ErrorMessage from './Error';
import '../css/Form.scss';

const mapStateToProps = (state) => {
  const { attachmentForm, attachment } = state;
  return {
    projectID: attachmentForm.projectID,
    attachmentFormVisible: attachmentForm.visible,
    errors: attachmentForm.errors,
    attachments: attachment.attachments,
  };
};

const mapDispatchToProps = (dispatch) => {
  const {
    closeAttachmentForm, getAllAttachment, createAttachment, deleteAttachment,
  } = attachmentAction;

  return {
    closeAttachmentForm: () => dispatch(closeAttachmentForm()),
    getAllAttachment: (projectID) => dispatch(getAllAttachment(projectID)),
    createAttachment: (params, projectID) => dispatch(createAttachment(params, projectID)),
    deleteAttachment: (id) => dispatch(deleteAttachment(id)),
  };
};

class AttachmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      link: '',
    };
  }

  componentDidMount() {
    const { projectID, getAllAttachment } = this.props;
    getAllAttachment(projectID);
  }

  handleCreate = () => {
    const { name, link } = this.state;
    const { projectID, createAttachment } = this.props;
    const params = { name, url: link };
    createAttachment(params, projectID);
  }

  handleDestroy = async (event) => {
    const { id } = event.currentTarget.dataset;
    const { deleteAttachment } = this.props;
    deleteAttachment(id);
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onChangeUrl = (event) => {
    const link = event.target.value;
    this.setState({ link });
  }

  stopPropagation = (event) => event.stopPropagation()

  render() {
    const { closeAttachmentForm, attachments, errors } = this.props;
    const { name, link } = this.state;

    return (
      <div className="modalOverlay" onClick={closeAttachmentForm}>
        <div className="modalForm" onClick={this.stopPropagation}>
          <div className="modalForm__title">Attachments</div>
          {errors.length !== 0 && <ErrorMessage action="Add link" errors={errors} />}
          <div className="modalFormUrl">
            <input
              type="text"
              className="modalFormUrl__name"
              placeholder="Label"
              value={name}
              onChange={this.onChangeName}
            />
            <input
              type="text"
              className="modalFormUrl__url"
              placeholder="URL"
              value={link}
              onChange={this.onChangeUrl}
            />
            <FontAwesomeIcon
              icon={['fas', 'plus-circle']}
              className="modalFormUrl__add"
              onClick={this.handleCreate}
            />
          </div>
          <div className="urlIndex">
            {attachments.map((attachment) => (
              <div className="urlList" key={attachment.id}>
                <FontAwesomeIcon icon={['fas', 'link']} className="urlList__icon" />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={attachment.url}
                  className="urlList__link"
                >
                  {attachment.name}
                </a>
                <FontAwesomeIcon
                  icon={['fas', 'trash-alt']}
                  className="urlList__delete"
                  data-id={attachment.id}
                  onClick={this.handleDestroy}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentForm);
