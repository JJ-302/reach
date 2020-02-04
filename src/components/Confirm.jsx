import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/Confirm.scss';

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
          <div className="confirmButton__confirm" onClick={confirm}>OK</div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
