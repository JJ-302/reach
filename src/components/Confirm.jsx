import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as confirmActions from '../store/confirm/actions';
import '../css/Confirm.scss';

const mapStateToProps = (state) => {
  const { confirm } = state;
  return {
    type: confirm.type,
    title: confirm.title,
    description: confirm.description,
    confirm: confirm.confirm,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { closeConfirm } = confirmActions;
  return {
    closeConfirm: () => dispatch(closeConfirm()),
  };
};

const confirmType = (type) => {
  switch (type) {
    case 'success':
      return { icon: ['fas', 'check'], className: 'confirm__icon--success' };
    case 'error':
      return { icon: ['fas', 'exclamation'], className: 'confirm__icon--error' };
    case 'ask':
      return { icon: ['fas', 'question'], className: 'confirm__icon--ask' };
    default:
      return null;
  }
};

const stopPropagation = (event) => event.stopPropagation();

const Confirm = (props) => {
  const {
    type,
    closeConfirm,
    title,
    description,
    confirm,
  } = props;

  const onClickConfirm = type === 'ask' ? confirm : closeConfirm;
  const iconType = confirmType(type);
  return (
    <div className="confirmOverlay" onClick={stopPropagation}>
      <div className="confirm">
        {iconType && (
          <div className={iconType.className}>
            <FontAwesomeIcon icon={iconType.icon} />
          </div>
        )}
        <div className="confirmText">
          <div className="confirmText__title">{title}</div>
          <div className="confirmText__description">{description}</div>
        </div>
        <div className="confirmButton">
          {type === 'ask'
            && <div className="confirmButton__cancel" onClick={closeConfirm}>Cancel</div>}
          <div className="confirmButton__confirm" onClick={onClickConfirm}>OK</div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
