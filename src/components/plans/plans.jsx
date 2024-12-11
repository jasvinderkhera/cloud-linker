import React from 'react'
import './plans.css'

function Plans() {
  return (
    <div>
      <h3 className='fw-bold'>Cloud Storage Plan</h3>
      <p className="text-center fs-5">Secure and Reliable cloud storage for Your Data </p>
      <div className="row gap-3">
        <div className="col md-2">
          
        </div>
        <div className="col md-4 freePlan rounded-5">
        {/* <h6 className="text-secondary">Basic Version</h6> */}
        </div>
        <div className="col md-4 paidPlan rounded-5">
        <h4 className="text-dark bg-white px-4 py-3 rounded-5 text-center">Paid Version</h4>
        <p className=' fs-5 text-center'>₹ 199/Month</p>
        <p className=" text-center mb-2">10MB speed</p>
        <p className=" text-center mb-2">photo</p>
        <p className=" text-center mb-2">High Quality</p>
        <p className=" text-center mb-2">5GB Storage</p>
        </div>
        <div className="col md-2"></div>
      </div>
    </div>
  )
}
 
export default Plans