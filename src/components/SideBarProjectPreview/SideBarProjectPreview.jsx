import React from 'react'
import "./SideBarProjectPreview.css";
import { formatDate } from '../../utils/date';

const SideBarProjectPreview = ({title, createdAt, onClick}) => {
  return <div className="SideBarProjectPreview" onClick={onClick}>
    <p className='p-title'>{title}</p>
    <p className="p-date">{formatDate(createdAt.seconds)}</p>
  </div>;
}

export default SideBarProjectPreview