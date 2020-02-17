import React, { Component } from 'react';
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

class VerificationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: [],
    };
  }

  onChangeEmail = (event) => {
    const email = event.target.value;
    this.setState({ email });
  }

  onClickOverlay = (event) => event.stopPropagation()

  handleSubmit = async () => {
    const { email } = this.state;
    const params = { email };
    const url = Utils.buildRequestUrl('/sessions/new');
    const response = await axios.get(url, { params }).catch((error) => error.response);
    if (response.status !== 200) {
      const { openConfirm } = this.props;
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }

    const { result, errors } = response.data;
    if (result) {
      const { openConfirm } = this.props;
      openConfirm(SENT_MESSAGE);
    } else {
      this.setState({ errors });
    }
  }

  render() {
    const { email, errors } = this.state;
    const { closeVerificationForm } = this.props;

    return (
      <div className="modalOverlay--verification" onClick={closeVerificationForm}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">Account verification</div>
          {errors.length !== 0 && <ErrorMessage action="Resource creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="登録済みメールアドレスを入力"
            value={email}
            onChange={this.onChangeEmail}
          />
          <button type="button" onClick={this.handleSubmit} className="modalForm__button">Send</button>
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(VerificationForm);
