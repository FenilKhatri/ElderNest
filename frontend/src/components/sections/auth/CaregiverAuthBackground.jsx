import React from 'react'
import AuthBackground from '../../ui/AuthBackground'
import CareGiverBG from "../../../assets/images/other/caregiverauthbg.avif";

const CaregiverAuthBackground = () => {
  return (
    <AuthBackground AuthBG={CaregiverBG} Description="Caregiver auth description" PersonDesignation="Caregiver designation" PersonName="Caregiver name"  />
  )
}

export default CaregiverAuthBackground