import React from 'react'
import { ValidatorTitleIcon } from '../ValidatorTitleIcon'

// removed icon
// <ValidatorTitleIcon networkBranch={networkBranch} type={type} />
export const ValidatorTitle = ({ extraClassName = '', text = '', type, networkBranch = '' }) => {
  return (
    <h3 className={`vl-ValidatorTitle ${extraClassName}`}>
      <span className={`vl-ValidatorTitle_Text`}>{text}</span>
    </h3>
  )
}
