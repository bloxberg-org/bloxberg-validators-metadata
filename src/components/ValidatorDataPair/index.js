import React from 'react'

export const ValidatorDataPair = ({ extraClassName = '', data }) => {
  return (
    <div className={`vl-ValidatorDataPair ${extraClassName}`}>
      {data.map((item, index) => {
        if (item == 'Full Name' || item == 'Address' || item == 'Research Field' || item == 'Institute Name') {
          return (
            <p key={index} className="vl-ValidatorDataPair_Info">
              {item}
            </p>
          )
        } else {
          return (
            <p key={index} className="vl-ValidatorDataPair_Information">
              {item}
            </p>
          )
        }
      })}
    </div>
  )
}
