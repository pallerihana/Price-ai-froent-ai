import React from 'react'
import ServicesBox from './ServicesBox'
import Recommended from './Recommended'
import Hospitalslist from './Hospitalslist'

const MiddlePage = () => {
  return (
    <div >
      <ServicesBox />
      <Recommended/>
      <Hospitalslist/>
    </div>
  )
}

export default MiddlePage
