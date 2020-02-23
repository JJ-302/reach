import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/Loading.scss';

const Loading = () => (
  <div className="loadingOverlay">
    <FontAwesomeIcon icon={['fab', 'react']} spin className="loadingIcon" />
  </div>
);

export default Loading;
