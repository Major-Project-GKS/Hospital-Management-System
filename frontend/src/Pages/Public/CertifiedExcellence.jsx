// src/components/CertifiedExcellence.jsx
import React from 'react';
import './CertifiedExcellence.css';

// Importing logo images with correct relative paths
import GovtLogo from '../../assets/Govt.webp';
import NABHLogo from '../../assets/NABH.webp';
import MedicalCouncilLogo from '../../assets/Medicalcouncil.webp';
import QualityHealthcareLogo from '../../assets/Qua.webp';
import ParamedicalCouncilLogo from '../../assets/Paramedical.webp';

const CertifiedExcellence = () => {
  // Define data for the logos to be scrolled
  const logos = [
    {
      imgSrc: GovtLogo,
      text: 'Medical Commission',
    },
    {
      imgSrc: NABHLogo,
      text: 'NABH Accredited',
    },
    {
      imgSrc: MedicalCouncilLogo,
      text: 'Government Approved',
    },
    {
      imgSrc: QualityHealthcareLogo,
      text: 'Medical Council',
    },
    {
      imgSrc: ParamedicalCouncilLogo,
      text: 'Quality Healthcare',
    },
    {
      imgSrc: ParamedicalCouncilLogo,
      text: 'Paramedical Council',
    }
  ];

  // Duplicate the logos to create a seamless looping scroll
  const scrollingLogos = [...logos, ...logos];

  return (
    <section className="certified-excellence">
      {/* Header Section */}
      <div className="header-container">
        <div className="title-section">
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