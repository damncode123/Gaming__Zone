import React from 'react'
import Navbar from './Navbar'
import img2 from '../Assests/dashboard image.png';
import img1 from '../Assests/img1.png';
import "../Styles/Dashboard.css"
function Dashboard() {
  return (
    <div className='min-h-screen'>
      <Navbar></Navbar>
      <div className="section-container">
      <div className="hero-section">
        <div className="text-section">
          <h2 className="text-title">
            Gaming Zone - One stop solution for your Boredom
          </h2>
          <p className="text-descritpion">
          At GameZone, our mission is to provide a diverse gaming experience that caters to players of all ages. Whether you're a seasoned gamer or just looking for some casual fun, our collection of games promises entertainment for everyone. Get ready to embark on a gaming adventure like never before!
          </p>
        </div>
        <div className="hero-image-section">
          <img className="hero-image1" src={img2} alt="img" />
        </div>
      </div>
      </div>
    </div>
  )
}

export default Dashboard
