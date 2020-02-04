import React from 'react';

import '../css/Error.scss';

const error = ({ action, errors }) => {
  const title = `${action} failed!`;
  return (
    <div className="error">
      <div className="error__title">{title}</div>
      <Messages errors={errors} />
    </div>
  );
};

const Messages = (props) => (
  props.errors.map((err) => <div className="error__message" key={err.error}>{err.error}</div>)
);

export default error;
