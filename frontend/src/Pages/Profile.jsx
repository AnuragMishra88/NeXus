import './Profile.css';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Api/AuthContext';
import { authService } from '../Api/authService';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // Add this state
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    // MANDATORY FIELDS (from your model)
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '', // For change password feature
    
    // OPTIONAL FIELDS (with defaults matching your model)
    linkedInProfile: '',
    collegeUniversity: 'Not provided',
    degreeProgram: 'Other',
    specialization: '',
    graduationYear: 2026,
    currentSemester: '',
    currentCGPA: 0,
    tenthPercentage: 0,
    twelfthPercentage: 0,
    activeBacklogs: '0',
    
    // CAREER & SKILLS FIELDS
    skills: [],
    preferredRole: '',
    preferredLocation: '',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    resumeUrl: '',
    resumeOriginalName: '',
    
    // ACCOUNT FIELDS
    role: 'student',
    profilePhoto: '',
    accountStatus: 'active',
    
    // ADDITIONAL FIELDS FROM REGISTER CONTROLLER
    collegeName: '',
    degree: '',
    cgpa: 0,
    location: '',
    linkedinProfile: '' // Note: different from linkedInProfile
  });

  // Fetch profile data using authService
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authService.getProfile();
        console.log('Profile Response:', response);
        
        if (response.success) {
          const userData = response.user;
          
          // Parse skills if they come as string
          let skillsArray = [];
          if (Array.isArray(userData.skills)) {
            skillsArray = userData.skills;
          } else if (typeof userData.skills === 'string') {
            skillsArray = userData.skills.split(',').filter(s => s.trim());
          }
          
          // Set profile with ALL fields from backend
          // Map backend fields to frontend state
          setProfile({
            // MANDATORY
            fullName: userData.fullName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            password: '', // Always empty for security
            
            // OPTIONAL EDUCATION
            linkedInProfile: userData.linkedInProfile || userData.linkedinProfile || '',
            collegeUniversity: userData.collegeUniversity || userData.collegeName || 'Not provided',
            degreeProgram: userData.degreeProgram || userData.degree || 'Other',
            specialization: userData.specialization || '',
            graduationYear: userData.graduationYear || 2026,
            currentSemester: userData.currentSemester || '',
            currentCGPA: userData.currentCGPA || userData.cgpa || 0,
            tenthPercentage: userData.tenthPercentage || 0,
            twelfthPercentage: userData.twelfthPercentage || 0,
            activeBacklogs: userData.activeBacklogs || '0',
            
            // CAREER
            skills: skillsArray,
            preferredRole: userData.preferredRole || '',
            preferredLocation: userData.preferredLocation || userData.location || '',
            experienceLevel: userData.experienceLevel || 'Fresher',
            jobType: userData.jobType || 'Full-time',
            resumeUrl: userData.resumeUrl || '',
            resumeOriginalName: userData.resumeOriginalName || '',
            
            // ACCOUNT
            role: userData.role || 'student',
            profilePhoto: userData.profilePhoto || '',
            accountStatus: userData.accountStatus || 'active',
            
            // ALIASES (for backward compatibility)
            collegeName: userData.collegeUniversity || '',
            degree: userData.degreeProgram || '',
            cgpa: userData.currentCGPA || 0,
            location: userData.preferredLocation || '',
            linkedinProfile: userData.linkedInProfile || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);
 // Update the save button to check both loading states
  const isSavingDisabled = loading || uploading || uploadingPhoto;
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare update data - DON'T include email (not updatable)
      // Include ALL fields from your model
      const updateData = {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        linkedInProfile: profile.linkedInProfile,
        collegeUniversity: profile.collegeUniversity,
        degreeProgram: profile.degreeProgram,
        specialization: profile.specialization,
        graduationYear: profile.graduationYear,
        currentSemester: profile.currentSemester,
        currentCGPA: profile.currentCGPA,
        tenthPercentage: profile.tenthPercentage,
        twelfthPercentage: profile.twelfthPercentage,
        activeBacklogs: profile.activeBacklogs,
        skills: profile.skills.join(','),
        preferredRole: profile.preferredRole,
        preferredLocation: profile.preferredLocation,
        experienceLevel: profile.experienceLevel,
        jobType: profile.jobType,
      };

      console.log('Sending update data:', updateData);
      
      const response = await authService.updateProfile(updateData);
      console.log('Update response:', response);
      
      if (response.success) {
        setIsEditing(false);
        // Update local profile state with response data
        if (response.user) {
          setProfile(prev => ({
            ...prev,
            fullName: response.user.fullName || prev.fullName,
            phoneNumber: response.user.phoneNumber || prev.phoneNumber,
            linkedInProfile: response.user.linkedInProfile || prev.linkedInProfile,
            collegeUniversity: response.user.collegeUniversity || prev.collegeUniversity,
            degreeProgram: response.user.degreeProgram || prev.degreeProgram,
            specialization: response.user.specialization || prev.specialization,
            graduationYear: response.user.graduationYear || prev.graduationYear,
            currentSemester: response.user.currentSemester || prev.currentSemester,
            currentCGPA: response.user.currentCGPA || prev.currentCGPA,
            skills: response.user.skills || prev.skills,
            preferredRole: response.user.preferredRole || prev.preferredRole,
            preferredLocation: response.user.preferredLocation || prev.preferredLocation,
            experienceLevel: response.user.experienceLevel || prev.experienceLevel,
            jobType: response.user.jobType || prev.jobType,
          }));
        }
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading resume...');
      
      const response = await authService.updateProfile(formData);
      console.log('Resume upload response:', response);
      
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          resumeUrl: response.user.resumeUrl || '',
          resumeOriginalName: file.name
        }));
        alert('Resume uploaded successfully!');
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(err.message || 'Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadProfilePhoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file (JPG, PNG, GIF)');
    return;
  }

  try {
    setUploadingPhoto(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file); // Append file to FormData

    console.log('Uploading profile photo...');
    
    // Pass the FormData object directly
    const response = await authService.uploadProfilePhoto(formData);
    console.log('Profile photo upload response:', response);
    
    if (response.success) {
      setProfile(prev => ({
        ...prev,
        profilePhoto: response.profilePhoto || ''
      }));
      alert('Profile photo updated successfully!');
    }
  } catch (err) {
    console.error('Error uploading photo:', err);
    setError(err.message || 'Error uploading photo');
  } finally {
    setUploadingPhoto(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProfile(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value)
      }));
    } else if (type === 'checkbox') {
      setProfile(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any previous errors when user starts typing
    if (error) setError(null);
  };

  const handleAddSkill = () => {
    const skill = prompt('Enter a skill:');
    if (skill && skill.trim() && !profile.skills.includes(skill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Debug: Check what data we have
  console.log('Current Profile State:', profile);
  console.log('Auth Context User:', user);

  if (!user) {
    return (
      <div className="auth-required">
        <h2>Please sign in to view your profile</h2>
      </div>
    );
  }

  if (loading && !isEditing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1>My Profile</h1>
        
        {/* Display error message if any */}
        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}
        
        <div className="profile-actions">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || uploading}
                className="save-btn"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Photo & Basic Info */}
      <div className="profile-photo-section">
        <div className="avatar-container">
          <div className="profile-avatar" style={{
            background: profile.profilePhoto 
              ? `url(${profile.profilePhoto}) center/cover no-repeat` 
              : '#646cff'
          }}>
            {!profile.profilePhoto && (profile.fullName?.charAt(0)?.toUpperCase() || 'U')}
          </div>
          {isEditing && (
            <label className="avatar-upload-btn">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadProfilePhoto}
                disabled={uploading}
              />
            </label>
          )}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="profile-name-input"
              />
              <div className="email-display">
                <span className="email-label">Email:</span>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="email-input-disabled"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="profile-name-display">{profile.fullName || 'No Name'}</h2>
              <p className="profile-email">
                <strong>Email:</strong> {profile.email}
              </p>
            </>
          )}
          <div className="profile-meta">
            <span className={`role-badge ${profile.role}`}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
            <span className={`status-badge ${profile.accountStatus}`}>
              {profile.accountStatus.charAt(0).toUpperCase() + profile.accountStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Three Column Layout for Better Organization */}
      <div className="profile-content-grid">
        {/* Column 1: Personal & Contact Info */}
        <div className="profile-card contact-card">
          <h3 className="card-header">Contact Information</h3>
          
          <div className="contact-grid">
            <div className="contact-field">
              <label className="field-label">Phone Number *</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="contact-input"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="contact-display">
                  {profile.phoneNumber || 'Not provided'}
                </p>
              )}
            </div>
            
            <div className="contact-field">
              <label className="field-label">LinkedIn Profile</label>
              {isEditing ? (
                <input
                  type="url"
                  name="linkedInProfile"
                  value={profile.linkedInProfile}
                  onChange={handleInputChange}
                  className="contact-input"
                  placeholder="https://linkedin.com/in/username"
                />
              ) : profile.linkedInProfile ? (
                <a 
                  href={profile.linkedInProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  {profile.linkedInProfile}
                </a>
              ) : (
                <p className="contact-display">
                  Not provided
                </p>
              )}
            </div>
            
            {/* Resume Section */}
            <div className="resume-section">
              <div className="resume-header">
                <h4 className="resume-title">Resume</h4>
                {profile.resumeUrl && (
                  <span className="resume-status">
                    Uploaded
                  </span>
                )}
              </div>
              
              {profile.resumeUrl ? (
                <div className="resume-card">
                  <div className="resume-content">
                    <div className="resume-info">
                      <p className="resume-name">
                        {profile.resumeOriginalName || 'Resume.pdf'}
                      </p>
                      <p className="resume-meta">
                        PDF Document • {new Date().toLocaleDateString()}
                      </p>
                    </div>
               <div className="resume-actions">
  {/* Simple View button - opens PDF in new tab */}
  <a 
  href={profile.resumeUrl.replace('/upload/', '/upload/fl_attachment:NeXus_resume/')} 
  download="NeXus_resume.pdf"
  target="_blank" 
  rel="noopener noreferrer"
  className="resume-view-btn"
>
  View
</a>
  
  {isEditing && (
    <label className="resume-change-btn">
      {uploading ? '⏳' : 'Change'}
      <input
        type="file"
        accept=".pdf"
        onChange={handleUploadResume}
        disabled={uploading}
      />
    </label>
  )}
</div>
                  </div>
                </div>
              ) : (
                <div className="resume-upload-area">
                  <div className="upload-icon">📄</div>
                  <p className="upload-text">No resume uploaded</p>
                  {isEditing && (
                    <label className="upload-label">
                      {uploading ? 'Uploading...' : 'Upload Resume (PDF)'}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleUploadResume}
                        disabled={uploading}
                      />
                    </label>
                  )}
                  <p className="upload-hint">
                    PDF files only, max 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Education Details */}
        <div className="profile-card education-card">
          <h3 className="card-header">Education Details</h3>
          
          <div className="education-grid">
            <div className="education-field">
              <label className="edu-label">College/University</label>
              {isEditing ? (
                <input
                  type="text"
                  name="collegeUniversity"
                  value={profile.collegeUniversity}
                  onChange={handleInputChange}
                  className="edu-input"
                />
              ) : (
                <p className="edu-display">
                  {profile.collegeUniversity}
                </p>
              )}
            </div>
            
            <div className="education-field">
              <label className="edu-label">Degree Program</label>
              {isEditing ? (
                <select
                  name="degreeProgram"
                  value={profile.degreeProgram}
                  onChange={handleInputChange}
                  className="edu-select"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="B.Com">B.Com</option>
                  <option value="BA">B.A</option>
                  <option value="MBA">MBA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="edu-display">
                  {profile.degreeProgram}
                </p>
              )}
            </div>
            
            <div className="education-field">
              <label className="edu-label">Specialization</label>
              {isEditing ? (
                <input
                  type="text"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleInputChange}
                  className="edu-input"
                  placeholder="e.g., Computer Science"
                />
              ) : (
                <p className="edu-display">
                  {profile.specialization || 'Not specified'}
                </p>
              )}
            </div>
            
            <div className="education-field">
              <label className="edu-label">Graduation Year</label>
              {isEditing ? (
                <input
                  type="number"
                  name="graduationYear"
                  value={profile.graduationYear}
                  onChange={handleInputChange}
                  min="2000"
                  max="2030"
                  className="edu-input"
                />
              ) : (
                <p className="edu-display">
                  {profile.graduationYear}
                </p>
              )}
            </div>
            
            <div className="education-field">
              <label className="edu-label">Current CGPA</label>
              {isEditing ? (
                <input
                  type="number"
                  name="currentCGPA"
                  value={profile.currentCGPA || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className="edu-input"
                  placeholder="0.00"
                />
              ) : (
                <p className="edu-display">
                  {profile.currentCGPA || 'Not specified'}
                </p>
              )}
            </div>
            
            <div className="education-field">
              <label className="edu-label">Current Semester</label>
              {isEditing ? (
                <input
                  type="text"
                  name="currentSemester"
                  value={profile.currentSemester}
                  onChange={handleInputChange}
                  className="edu-input"
                  placeholder="e.g., Semester 6"
                />
              ) : (
                <p className="edu-display">
                  {profile.currentSemester || 'Not specified'}
                </p>
              )}
            </div>
          </div>
          
          {/* Academic Scores */}
          <div className="academic-scores">
            <h4 className="scores-header">Academic Scores</h4>
            <div className="scores-grid">
              <div className="score-field">
                <label className="score-label">10th Percentage (%)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="tenthPercentage"
                    value={profile.tenthPercentage || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="score-input"
                  />
                ) : (
                  <p className="score-display">
                    {profile.tenthPercentage || 'Not specified'}%
                  </p>
                )}
              </div>
              
              <div className="score-field">
                <label className="score-label">12th Percentage (%)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="twelfthPercentage"
                    value={profile.twelfthPercentage || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="score-input"
                  />
                ) : (
                  <p className="score-display">
                    {profile.twelfthPercentage || 'Not specified'}%
                  </p>
                )}
              </div>
            </div>
            
            <div className="backlogs-field">
              <label className="backlogs-label">Active Backlogs</label>
              {isEditing ? (
                <select
                  name="activeBacklogs"
                  value={profile.activeBacklogs}
                  onChange={handleInputChange}
                  className="backlogs-select"
                >
                  <option value="0">0</option>
                  <option value="1-2">1-2</option>
                  <option value="3-5">3-5</option>
                  <option value="5+">5+</option>
                </select>
              ) : (
                <p className="backlogs-display">
                  {profile.activeBacklogs === '0' ? 'No active backlogs' : `${profile.activeBacklogs} active backlog(s)`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Career & Skills */}
        <div className="profile-card career-card">
          <h3 className="card-header">Career Preferences & Skills</h3>
          
          {/* Career Preferences */}
          <div className="career-preferences">
            <h4 className="career-header">Career Preferences</h4>
            <div className="career-grid">
              <div className="career-field">
                <label className="career-label">Preferred Role</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="preferredRole"
                    value={profile.preferredRole}
                    onChange={handleInputChange}
                    className="career-input"
                    placeholder="e.g., Software Developer"
                  />
                ) : (
                  <p className="career-display">
                    {profile.preferredRole || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div className="career-field">
                <label className="career-label">Preferred Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="preferredLocation"
                    value={profile.preferredLocation}
                    onChange={handleInputChange}
                    className="career-input"
                    placeholder="e.g., Bangalore, Remote"
                  />
                ) : (
                  <p className="career-display">
                    {profile.preferredLocation || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div className="career-field">
                <label className="career-label">Experience Level</label>
                {isEditing ? (
                  <select
                    name="experienceLevel"
                    value={profile.experienceLevel}
                    onChange={handleInputChange}
                    className="career-select"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                ) : (
                  <p className="career-display">
                    {profile.experienceLevel}
                  </p>
                )}
              </div>
              
              <div className="career-field">
                <label className="career-label">Job Type</label>
                {isEditing ? (
                  <select
                    name="jobType"
                    value={profile.jobType}
                    onChange={handleInputChange}
                    className="career-select"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                ) : (
                  <p className="career-display">
                    {profile.jobType}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="skills-section">
            <div className="skills-header">
              <h4 className="skills-title">Skills</h4>
              {isEditing && (
                <button
                  onClick={handleAddSkill}
                  className="skills-add-btn"
                >
                  + Add Skill
                </button>
              )}
            </div>
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="skill-remove"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {profile.skills.length === 0 && (
                <p className="no-skills-message">
                  {isEditing ? 'Add your skills to get better recommendations' : 'No skills added yet'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Note */}
      <div className="profile-footer">
        <p>
          <strong>Note:</strong> Your profile information helps us provide personalized recommendations 
          and match you with relevant opportunities. Keep your information updated for the best experience.
        </p>
      </div>
    </div>
  );
};

export default Profile;