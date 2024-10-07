import React from 'react'

export const IconAll = ({ networkBranch }) => {
  return (
    <svg className={`nl-IconAll`} xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path
        className={`nl-IconAll_Path nl-IconAll_Path-${networkBranch}`}
        d="M17 12H9a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3h.184A2.962 2.962 0 0 1 3 11V9a3 3 0 0 1 3-3c.549 0 1.057.158 1.5.416A2.968 2.968 0 0 1 9 6h.184A2.962 2.962 0 0 1 9 5V3a3 3 0 1 1 6 0v2c0 .353-.072.686-.184 1H15a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1zM7 9a1 1 0 0 0-2 0v2a1 1 0 0 0 2 0V9zm-4 5a1 1 0 0 0-1 1v1h8v-1a1 1 0 0 0-1-1H3zM13 3a1 1 0 0 0-2 0v2a1 1 0 0 0 2 0V3zm3 6a1 1 0 0 0-1-1H9c-.061 0-.115.024-.173.035C8.931 8.339 9 8.66 9 9v1h7V9z"
        fillRule="evenodd"
        fill="white"
        //stroke="white"
      />
    </svg>
  )
}
