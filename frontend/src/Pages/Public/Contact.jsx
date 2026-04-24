import React, { useState } from 'react';
import { User, Mail, Phone, Building2, Stethoscope, MessageSquare, Send, MapPin, ExternalLink } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    // The hospital's WhatsApp number (from your design)
    const whatsappNumber = "918299431275"; 
    
    // Format the message for WhatsApp
    const text = `*New Clinic Inquiry*%0A
*Name:* ${formData.name}%0A
*Email:* ${formData.email}%0A
*Phone:* ${formData.phone}%0A
*Department:* ${formData.department}%0A
*Service:* ${formData.service}%0A
*Message:* ${formData.message}`;

    // Open WhatsApp in a new tab
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">
        
        {/* LEFT COLUMN: The Form */}
        <div className="contact-form-card">
          <div className="contact-header">
            <h2>Contact Our Clinic</h2>
            <p>Fill the form — we'll open WhatsApp so you can connect with us instantly.</p>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="whatsapp-form">
            <div className="form-row">
              <div className="input-group">
                <label><User size={16} /> Full Name</label>
                <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label><Mail size={16} /> Email</label>
                <input type="email" name="email" placeholder="example@domain.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label><Phone size={16} /> Phone</label>
                <input type="tel" name="phone" placeholder="1234567890" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label><Building2 size={16} /> Department</label>
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label><Stethoscope size={16} /> Service</label>
              <select name="service" value={formData.service} onChange={handleChange} required>
                <option value="">Select Service (or choose Department above)</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Consultation">Consultation</option>
                <option value="Lab Test">Lab Test</option>
              </select>
            </div>

            <div className="input-group">
              <label><MessageSquare size={16} /> Message</label>
              <textarea name="message" rows="4" placeholder="Describe your concern briefly..." value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <button type="submit" className="btn-whatsapp">
              <Send size={18} /> Send via WhatsApp
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Info & Map */}
        <div className="contact-info-column">
          
          {/* Info Card */}
          <div className="info-card">
            <h3>Visit Our Clinic</h3>
            <p className="address-text">Bhubaneswar, Odisha, India</p>
            <div className="info-line">
              <Phone size={16} /> <span>8299431275</span>
            </div>
            <div className="info-line">
              <Mail size={16} /> <span>info@gshealthcare.com</span>
            </div>
          </div>

          {/* Map Card */}
          <div className="map-card">
            <a href="https://maps.google.com/?q=Bhubaneswar,Odisha" target="_blank" rel="noreferrer" className="open-map-btn">
              Open in Maps <ExternalLink size={14} />
            </a>
            <iframe 
              title="Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53375084988!2d85.73356079999999!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33c8b!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1712060000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          {/* Hours Card */}
          <div className="hours-card">
            <h4>Clinic Hours</h4>
            <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;