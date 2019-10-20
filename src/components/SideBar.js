import React from 'react'
import '../css/SideBar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SideBar = () => (
  <div className="sidebar">
    <FontAwesomeIcon icon={['fas', 'plus']} className="sidebar__icon" />
    <FontAwesomeIcon icon={['fas', 'user-plus']} className="sidebar__icon" />
    <FontAwesomeIcon icon={['fas', 'tags']} className="sidebar__icon" />
  </div>
)

export default SideBar
