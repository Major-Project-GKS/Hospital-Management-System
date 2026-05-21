import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EditProfileComp.css';

const EditProfileComp = ({ initialData, onUpdateSuccess, onCancel, role }) => {
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const updatePayload = new FormData();
    updatePayload.append('name', formData.name);
    updatePayload.append('phone', formData.phone);
    updatePayload.append('email', formData.email);
    if (selectedPhoto) {
      updatePayload.append('photo', selectedPhoto);
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/profile/update/${userId}`, updatePayload);
      if (res.data.success) {
        toast.success('Profile changes saved successfully!');
        localStorage.setItem('userName', res.data.data.name);
        if (onUpdateSuccess) {
          onUpdateSuccess(res.data.data);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="edit-profile-card">
      <div className="profile-card-header">
        <h3>Edit Account Parameters</h3>
      </div>
      
      <form onSubmit={handleSave} className="edit-profile-form">
        <div className="avatar-upload-row">
          <div className="avatar-preview-box">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              <span className="default-avatar-icon">📷</span>
            )}
          </div>
          <div>
            <label className="file-upload-label">
              Choose New Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div className="profile-input-grid">
          <div className="form-field-block">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          
          <div className="form-field-block">
            <label>Phone Number</label>
            <input type="tel" name="phone" maxLength="10" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})} required />
          </div>

          <div className="form-field-block full-width-field">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-action-row">
          <button type="submit" disabled={isUpdating} className="btn-save-profile">
            {isUpdating ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel-profile">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileComp;