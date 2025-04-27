import React from 'react'
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import "./cssfolder/footer.css"






const Footerpage = () => {
  return (
    <div className="footerdesign">
      <div className='footerdesignpart'>
        <div className="footerdivision">
        <h1>Price AI vision Jatayu4</h1>
        <div className="mailenter">
          <input type="text" placeholder='Enter mail →' />
          <button>Subcribe</button>
        </div>
        </div>
        <div className="contactdetailes">
          
          <div className="c1">
          <h1>Contact Detailes</h1>
            <p><FaUser className="text-blue-500 text-3xl" /> Palle Anil</p>
            <p><FaPhone className="text-green-500 text-3xl" />+917989847811</p>
            <p><FaHome className="text-purple-500 text-3xl" />Qis college college of engineeering and technology</p>
            <p><FaMapMarkerAlt className="text-red-500" />ongole,AP - 523001</p>
          </div>
          <div className="c2">
            <p>About us</p>
            <p>Privacy & policy</p>
            <p>Terms & conditions</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Footerpage

