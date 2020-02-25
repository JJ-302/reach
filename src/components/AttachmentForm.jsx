import React, { useState, useEffect } from 'react';
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

const AttachmentForm = (props) => {
  const {
    closeAttachmentForm,
    attachments,
    errors,
    getAllAttachment,
    createAttachment,
    deleteAttachment,
    projectID,
  } = props;

  const [name, setName] = useState('');
  const [link, setURL] = useState('');

  useEffect(() => {
    getAllAttachment(projectID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    const params = { name, url: link };
    createAttachment(params, projectID);
  };

  const handleDestroy = async (event) => {
    const { id } = event.currentTarget.dataset;
    deleteAttachment(id);
  };

  const onChangeName = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const onChangeUrl = (event) => {
    const { value } = event.target;
    setURL(value);
  };

  const stopPropagation = (event) => event.stopPropagation();

  return (
    <div className="modalOverlay" onClick={closeAttachmentForm}>
      <div className="modalForm" onClick={stopPropagation}>
        <div className="modalForm__title">Attachments</div>
        {errors.length !== 0 && <ErrorMessage action="Add link" errors={errors} />}
        <div className="modalFormUrl">
          <input
            type="text"
            className="modalFormUrl__name"
            placeholder="Label"
            value={name}
            onChange={onChangeName}
          />
          <input
            type="text"
            className="modalFormUrl__url"
            placeholder="URL"
            value={link}
            onChange={onChangeUrl}
          />
          <FontAwesomeIcon
            icon={['fas', 'plus-circle']}
            className="modalFormUrl__add"
            onClick={handleCreate}
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
                onClick={handleDestroy}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentForm);
