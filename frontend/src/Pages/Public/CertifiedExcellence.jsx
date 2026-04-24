// src/components/CertifiedExcellence.jsx
import React from 'react';
import './CertifiedExcellence.css';

// Importing logo images from src/assets
import GovtLogo from '../../../src/assets/Govt.WEBP';
import NABHLogo from '../../../src/assets/NABH.WEBP';
import MedicalCouncilLogo from '../../../src/assets/Medicalcouncil.WEBP';
import QualityHealthcareLogo from '../../../src/assets/Qua.WEBP';
import ParamedicalCouncilLogo from '../../../src/assets/Paramedical.WEBP';

const CertifiedExcellence = () => {
  // Define data for the logos to be scrolled
  const logos = [
    {
      imgSrc: GovtLogo,
      text: 'Medical Commission', // Verbatim caption from image
    },
    {
      imgSrc: NABHLogo,
      text: 'NABH Accredited', // Verbatim caption from image
    },
    {
      imgSrc: MedicalCouncilLogo,
      text: 'Government Approved', // Verbatim caption from image
    },
    {
      imgSrc: QualityHealthcareLogo,
      text: 'Medical Council', // Verbatim caption from image
    },
    {
      imgSrc: ParamedicalCouncilLogo,
      text: 'Quality Healthcare', // Verbatim caption from image
    },
    {
        imgSrc: ParamedicalCouncilLogo, // Duplicate for spacing/pattern, can replace with actual 'Paramedical Council' if file exists
        text: 'Paramedical Council', // Verbatim caption from image
    }
  ];

  // Duplicate the logos to create a seamless looping scroll
  const scrollingLogos = [...logos, ...logos];

  return (
    <section className="certified-excellence">
      {/* Header Section */}
      <div className="header-container">
        <div className="title-section">
          {/* Flanking lines with stylized pattern */}
          <div className="line-container">
            <div className="dash dash-left"></div>
            <div className="long-line"></div>
            <div className="dash dash-right"></div>
          </div>
          <div className="title-gap"></div>
          <h2>CERTIFIED & EXCELLENCE</h2>
          <div className="title-gap"></div>
          <div className="line-container">
            <div className="dash dash-left"></div>
            <div className="long-line"></div>
            <div className="dash dash-right"></div>
          </div>
        </div>
        <p className="subtitle">
          Government recognized and internationally accredited healthcare standards
        </p>
        {/* Officially Certified Badge */}
        <div className="officially-certified">
          <span className="certified-text">
            <span className="dot"></span>OFFICIALLY CERTIFIED
          </span>
        </div>
      </div>

      {/* Scrolling Logo Section */}
      <div className="logo-scroller-outer">
        <div className="logo-scroller-inner">
          {scrollingLogos.map((logo, index) => (
            <div className="logo-item" key={index}>
              <img src={logo.imgSrc} alt={logo.text} />
              <p>{logo.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertifiedExcellence;