import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { INTERNAL_SERVER_ERROR, SENT_MESSAGE } from '../store/confirm/types';
import * as confirmActions from '../store/confirm/actions';
import * as verificationActions from '../store/verification/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';

const mapDispatchToProps = (dispatch) => {
  const { openConfirm } = confirmActions;
  const { closeVerificationForm } = verificationActions;
  return {
    openConfirm: (payload) => dispatch(openConfirm(payload)),
    closeVerificationForm: () => dispatch(closeVerificationForm()),
  };
};

const VerificationForm = (props) => {
  const { closeVerificationForm, openConfirm } = props;

  const [email, setEmail] = useState('');
  const [errors, addErrors] = useState([]);

  const onChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const onClickOverlay = (event) => event.stopPropagation();

  const handleSubmit = async () => {
    const params = { email };
    const url = Utils.buildRequestUrl('/sessions/new');
    const response = await axios.get(url, { params }).catch((error) => error.response);
    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }

    const { result } = response.data;
    if (result) {
      openConfirm(SENT_MESSAGE);
    } else {
      addErrors(response.data.errors);
    }
  };

  return (
    <div className="modalOverlay--verification" onClick={closeVerificationForm}>
      <div className="modalForm" onClick={onClickOverlay}>
        <div className="modalForm__title">Account verification</div>
        {errors.length !== 0 && <ErrorMessage action="Resource creation" errors={errors} />}
        <input
          type="text"
          className="modalForm__textInput"
          placeholder="登録済みメールアドレスを入力"
          value={email}
          onChange={onChangeEmail}
        />
        <button type="button" onClick={handleSubmit} className="modalForm__button">Send</button>
      </div>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(VerificationForm);
