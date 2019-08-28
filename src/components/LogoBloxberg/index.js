import React from 'react'
import logoBloxberg from './logo.png'
import { NavLink } from 'react-router-dom'

export const LogoBloxberg = ({ href = null, extraClass = '' }) => {
  return (
    <NavLink to={href} className={`sw-LogoBloxberg ${extraClass}`}>
      <img className="sw-LogoBloxberg_Image" src={logoBloxberg} alt="" />
    </NavLink>
  )
}
