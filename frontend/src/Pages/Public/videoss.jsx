import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./videoss.css";

// Import your local media asset from src/assets/video
import laboratoryVideo from "../../assets/video.mp4";

export default function Videoss() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Main structural copy animations (Adjusted delays since navbar is removed)
      gsap.from(".gs-hero-heading", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(".gs-hero-sub, .gs-hero-cta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.25,
      });

      gsap.from(".gs-hero-badge", {
        scale: 0.6,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        delay: 0.2,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={root} id="gs-top" className="gs-hero-container position-relative overflow-hidden d-flex align-items-center">
      {/* Background Loop Laboratory Video Layer */}
      <div className="video-bg-wrapper position-absolute top-0 start-0 w-100 h-100">
        <video
          autoPlay
          loop
          muted
          playsInline
          src={laboratoryVideo}
          className="gs-backend-loop-video"
        />
        <div className="gs-dark-overlay-scrim position-absolute top-0 start-0 w-100 h-100" />
      </div>

      {/* GS HEALTHCARE MAIN CORE PANEL HERO WORKSPACE */}
      <div className="container position-relative gs-hero-content-alignment">
        <div className="row align-items-center pt-5 pb-5">
          {/* LEFT SIDE PANEL */}
          <div className="col-lg-7 text-white">
            <span className="badge rounded-pill bg-emerald-subtle text-emerald gs-hero-badge mb-3 text-uppercase">
              GS Healthcare Operational Node
            </span>
            <h1 className="display-4 fw-bold gs-hero-heading mb-3">
              Turning critical healthcare into shared wellness.
            </h1>
            <p className="lead text-white-50 gs-hero-sub mb-4">
              A modern digital health network. Real-time medical practitioner allocation, 
              automated duty rosters, and precision patient metrics tracked continuously.
            </p>
            <div className="d-flex flex-wrap gap-3 gs-hero-cta">
              <a href="/doctors" className="btn btn-emerald fw-semibold px-4 py-2 rounded-pill text-decoration-none">
                Explore Specialists
              </a>
              <a href="/contact" className="btn btn-outline-light fw-semibold px-4 py-2 rounded-pill text-decoration-none">
                Learn how we work
              </a>
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="col-lg-5 d-none d-lg-flex justify-content-end">
            <div className="gs-metric-glowing-circle rounded-circle d-flex flex-column justify-content-center align-items-center text-center">
              <h2 className="fw-bold mb-1 text-dark">
                2026 Active
              </h2>
              <p className="mb-2 small text-dark-50 fw-bold text-uppercase tracking-wider">
                Bhubaneswar • Odisha
              </p>
              <a href="/doctors" className="text-dark fw-bold text-decoration-none gs-circle-link">
                View Duty Schedules &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}