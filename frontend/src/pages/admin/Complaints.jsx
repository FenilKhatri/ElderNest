import React, { useEffect } from 'react'

const Complaints = () => {

  useEffect(() => {
    console.log("Complaints Mounted");
  }, []);

  return (
    <div>Complaints</div>
  )
}

export default Complaints