import React from 'react'
import diamond from './diamond.png'

export const MainTitle = ({ extraClassName = '', text = '', extraText = undefined }) => {
  return (
    <div className={`sw-MainTitle ${extraClassName}`}>
      <img className="sw-diamond" src={diamond} alt="" />
      <div className="sw-MainTitle_Content">
        <h1 className="sw-MainTitle_Text">{text}</h1>
        {extraText ? <h2 className="sw-MainTitle_ExtraText" dangerouslySetInnerHTML={{ __html: extraText }} /> : null}
      </div>
    </div>
  )
}
