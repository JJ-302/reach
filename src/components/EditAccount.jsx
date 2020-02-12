import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as accountActions from '../store/account/actions';
import * as projectActions from '../store/project/actions';
import * as confirmActions from '../store/confirm/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import '../css/Session.scss';

const mapStateToProps = (state) => {
  const { accountForm } = state;
  return {
    errors: accountForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { closeAccountForm, updateAccount } = accountActions;
  const { getAllProjects } = projectActions;
  const { openConfirm } = confirmActions;
  return {
    closeAccountForm: () => dispatch(closeAccountForm()),
    updateAccount: (params) => dispatch(updateAccount(params)),
    getAllProjects: () => dispatch(getAllProjects()),
    openConfirm: (payload) => dispatch(openConfirm(payload)),
  };
};

class EditAccuount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      avatar: null,
      name: '',
      email: '',
    };
  }

  componentDidMount() {
    this.getCurrentAccount();
  }

  getCurrentAccount = async () => {
    const url = Utils.buildRequestUrl('/users/edit');
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      const { openConfirm } = this.props;
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }
    const { avatar, name, email } = response.data.user;
    this.setState({ uri: avatar, name, email });
  }

  handleUpdate = async () => {
    const { avatar, name, email } = this.state;
    const params = new FormData();
    params.append('user[name]', name);
    params.append('user[email]', email);
    if (avatar) {
      params.append('user[avatar]', avatar);
    }

    const { getAllProjects, updateAccount } = this.props;
    await updateAccount(params);
    getAllProjects();
  }

  onChangeFile = (event) => {
    const avatar = event.target.files[0];
    const uri = URL.createObjectURL(avatar);
    this.setState({ uri, avatar });
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onChangeEmail = (event) => {
    const email = event.target.value;
    this.setState({ email });
  }

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const { closeAccountForm, errors } = this.props;
    const { uri, name, email } = this.state;

    return (
      <div className="background--edit" onClick={closeAccountForm}>
        <div className="session--edit" onClick={this.onClickOverlay}>
          <div className="session__title">Edit account</div>
          {errors.length !== 0 && <ErrorMessage action="Registration" errors={errors} />}
          <label htmlFor="avatarForm" className="session__avatar">
            <input
              id="avatarForm"
              type="file"
              className="session__fileField"
              onChange={this.onChangeFile}
            />
            {uri === ''
              ? <FontAwesomeIcon icon={['fas', 'user']} className="session__fileIcon" />
              : <img src={uri} alt="avatar" className="session__preview" />}
          </label>
          <div className="session__fileLabel">Upload your avatar</div>
          <input
            type="text"
            className="session__name"
            placeholder="Name"
            value={name}
            onChange={this.onChangeName}
          />
          <input
            type="text"
            className="session__email"
            placeholder="Email"
            value={email}
            onChange={this.onChangeEmail}
          />
          <button type="button" onClick={this.handleUpdate} className="session__submit">
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccuount);
