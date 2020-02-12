import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as accountActions from '../store/account/actions';
import * as projectActions from '../store/project/actions';
import ErrorMessage from './Error';
import Confirm from './Confirm';
import Utils from '../utils/Utils';
import {
  badRequest,
  checkParams,
  reload,
  serverError,
} from '../utils/Text';

import '../css/Session.scss';

const mapDispatchToProps = (dispatch) => {
  const { closeAccountForm, updateAccount } = accountActions;
  const { getAllProjects } = projectActions;
  return {
    closeAccountForm: () => dispatch(closeAccountForm()),
    updateAccount: (params) => dispatch(updateAccount(params)),
    getAllProjects: () => dispatch(getAllProjects()),
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
      errors: [],
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  componentDidMount() {
    this.token = localStorage.getItem('token');
    this.getCurrentAccount();
  }

  getCurrentAccount = async () => {
    const url = Utils.buildRequestUrl('/users/edit');
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
    });

    const { is_authenticated, user } = await response.json();
    if (is_authenticated) {
      const { avatar, name, email } = user;
      this.avatar = avatar;
      this.name = name;
      this.email = email;
      this.setState({ uri: avatar, name, email });
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm);
    }
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

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    });
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const { closeAccountForm } = this.props;
    const {
      uri,
      name,
      email,
      errors,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    return (
      <div className="background--edit" onClick={closeAccountForm}>
        <div className="session" onClick={this.onClickOverlay}>
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
        {confirmVisible && (
          <Confirm
            type={confirmType}
            closeConfirm={this.closeConfirm}
            title={confirmTitle}
            description={confirmDescription}
            confirm={confirm}
          />
        )}
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(EditAccuount);
