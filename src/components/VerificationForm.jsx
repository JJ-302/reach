import React, { Component } from 'react';

import ErrorMessage from './Error';

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

  handleSubmit = () => {
    // TODO
  }

  render() {
    const { email, errors } = this.state;
    const { closeResourceForm } = this.props;

    return (
      <div className="modalOverlay" onClick={closeResourceForm}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">Send message for confirm</div>
          {errors.length !== 0 && <ErrorMessage action="Resource creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="登録済みメールアドレスを入力"
            value={email}
            onChange={this.onChangeName}
          />
          <button type="button" onClick={this.handleSubmit} className="modalForm__button">Send</button>
        </div>
      </div>
    );
  }
}

export default VerificationForm;
