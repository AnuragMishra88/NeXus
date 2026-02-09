import './Register.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaUniversity,
  FaGraduationCap, FaFileAlt, FaCalendarAlt, FaArrowRight,
  FaArrowLeft, FaCheck, FaUpload, FaBook, FaPercentage,
  FaBriefcase, FaMapMarkerAlt, FaTimes
} from 'react-icons/fa';

const Register = ({ setActivePage }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1 Fields
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    
    // Page 2 Fields
    collegeName: '',
    degree: '',
    specialization: '',
    graduationYear: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    resume: null,
    skills: [],
    currentSkill: '',
    
    // Additional fields
    currentSemester: '',
    cgpa: '',
    backlogs: '0',
    preferredRole: '',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    location: '',
    linkedinProfile: ''
  });

  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Add modal animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validatePage1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors = {};
    
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.degree) newErrors.degree = 'Degree is required';
    if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    if (!formData.tenthPercentage) newErrors.tenthPercentage = '10th percentage is required';
    else if (formData.tenthPercentage < 0 || formData.tenthPercentage > 100) {
      newErrors.tenthPercentage = 'Percentage must be between 0-100';
    }
    
    if (!formData.twelfthPercentage) newErrors.twelfthPercentage = '12th percentage is required';
    else if (formData.twelfthPercentage < 0 || formData.twelfthPercentage > 100) {
      newErrors.twelfthPercentage = 'Percentage must be between 0-100';
    }
    
    if (!formData.resume) newErrors.resume = 'Resume is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSkillAdd = () => {
    if (formData.currentSkill.trim() && !formData.skills.includes(formData.currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.currentSkill.trim()],
        currentSkill: ''
      });
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleNextPage = () => {
    if (validatePage1()) {
      setCurrentPage(2);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate(-1); // Go back to previous page
      setActivePage('home');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePage2()) {
      console.log('Form submitted:', formData);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Registration successful!');
        handleCloseModal();
      } catch (error) {
        alert('Registration failed. Please try again.');
      }
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleCloseModal}>
      <div 
        className={`modal-container ${isVisible ? 'visible' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create Your NEXUS Account</h2>
          <button className="close-btn" onClick={handleCloseModal}>
            <FaTimes />
          </button>
        </div>

        <div className="register-card">
          <div className="progress-steps">
            <div className={`step ${currentPage >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Personal Info</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentPage >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Academic Details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentPage === 1 ? (
              <div className="form-page page-1">
                {/* Row 1: Full Name & Email */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="fullName">
                      <FaUser className="input-icon" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={errors.fullName ? 'error' : ''}
                      autoFocus
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                {/* Row 2: Password & Confirm Password */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="password">
                      <FaLock className="input-icon" />
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                    <div className="password-requirements">
                      <span className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                        <FaCheck /> At least 8 characters
                      </span>
                    </div>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="confirmPassword">
                      <FaLock className="input-icon" />
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && (
                      <span className="error-message">{errors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                {/* Row 3: Phone Number & LinkedIn */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="phoneNumber">
                      <FaPhone className="input-icon" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit phone number"
                      className={errors.phoneNumber ? 'error' : ''}
                    />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="linkedinProfile">
                      <FaEnvelope className="input-icon" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      id="linkedinProfile"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="next-btn" onClick={handleNextPage}>
                    Continue to Academic Details <FaArrowRight />
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-page page-2">
                {/* Row 1: College & Degree */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="collegeName">
                      <FaUniversity className="input-icon" />
                      College/University *
                    </label>
                    <input
                      type="text"
                      id="collegeName"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      placeholder="Enter your college name"
                      className={errors.collegeName ? 'error' : ''}
                    />
                    {errors.collegeName && <span className="error-message">{errors.collegeName}</span>}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="degree">
                      <FaGraduationCap className="input-icon" />
                      Degree/Program *
                    </label>
                    <select
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className={errors.degree ? 'error' : ''}
                    >
                      <option value="">Select your degree</option>
                      <option value="B.Tech">B.Tech / B.E.</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="B.Com">B.Com</option>
                      <option value="BBA">BBA</option>
                      <option value="BA">B.A.</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="MCA">MCA</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.degree && <span className="error-message">{errors.degree}</span>}
                  </div>
                </div>

                {/* Row 2: Specialization & Graduation Year */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="specialization">
                      <FaBook className="input-icon" />
                      Specialization
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div className="form-group half">
                    <label htmlFor="graduationYear">
                      <FaCalendarAlt className="input-icon" />
                      Graduation Year *
                    </label>
                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className={errors.graduationYear ? 'error' : ''}
                    >
                      <option value="">Select graduation year</option>
                      {Array.from({ length: 6 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                    {errors.graduationYear && (
                      <span className="error-message">{errors.graduationYear}</span>
                    )}
                  </div>
                </div>

                {/* Row 3: Current Semester & CGPA */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="currentSemester">
                      <FaGraduationCap className="input-icon" />
                      Current Semester
                    </label>
                    <select
                      id="currentSemester"
                      name="currentSemester"
                      value={formData.currentSemester}
                      onChange={handleInputChange}
                    >
                      <option value="">Select semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="cgpa">
                      <FaPercentage className="input-icon" />
                      Current CGPA
                    </label>
                    <input
                      type="number"
                      id="cgpa"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      placeholder="e.g., 8.5"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Row 4: 10th & 12th Percentage */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="tenthPercentage">
                      <FaFileAlt className="input-icon" />
                      10th Percentage *
                    </label>
                    <input
                      type="number"
                      id="tenthPercentage"
                      name="tenthPercentage"
                      value={formData.tenthPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      className={errors.tenthPercentage ? 'error' : ''}
                    />
                    {errors.tenthPercentage && (
                      <span className="error-message">{errors.tenthPercentage}</span>
                    )}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="twelfthPercentage">
                      <FaFileAlt className="input-icon" />
                      12th Percentage *
                    </label>
                    <input
                      type="number"
                      id="twelfthPercentage"
                      name="twelfthPercentage"
                      value={formData.twelfthPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      className={errors.twelfthPercentage ? 'error' : ''}
                    />
                    {errors.twelfthPercentage && (
                      <span className="error-message">{errors.twelfthPercentage}</span>
                    )}
                  </div>
                </div>

                {/* Row 5: Backlogs & Resume Upload */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="backlogs">
                      <FaFileAlt className="input-icon" />
                      Active Backlogs
                    </label>
                    <select
                      id="backlogs"
                      name="backlogs"
                      value={formData.backlogs}
                      onChange={handleInputChange}
                    >
                      <option value="0">0 Backlogs</option>
                      <option value="1">1 Backlog</option>
                      <option value="2">2 Backlogs</option>
                      <option value="3">3 Backlogs</option>
                      <option value="4+">4+ Backlogs</option>
                    </select>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="resume">
                      <FaUpload className="input-icon" />
                      Upload Resume *
                    </label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleInputChange}
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                      />
                      <label htmlFor="resume" className="file-upload-label">
                        {formData.resume ? formData.resume.name : 'Choose file (PDF, DOC)'}
                      </label>
                    </div>
                    {errors.resume && <span className="error-message">{errors.resume}</span>}
                    {formData.resume && (
                      <div className="file-preview">
                        <FaFileAlt /> {formData.resume.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 6: Skills Input */}
                <div className="form-group full-width">
                  <label>Skills (Add relevant skills)</label>
                  <div className="skills-input-container">
                    <input
                      type="text"
                      value={formData.currentSkill}
                      onChange={(e) => setFormData({ ...formData, currentSkill: e.target.value })}
                      placeholder="Add a skill and press Enter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                    />
                    <button type="button" className="add-skill-btn" onClick={handleSkillAdd}>
                      Add
                    </button>
                  </div>
                  <div className="skills-tags">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button type="button" onClick={() => handleSkillRemove(skill)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Row 7: Career Preferences */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="preferredRole">
                      <FaBriefcase className="input-icon" />
                      Preferred Role
                    </label>
                    <select
                      id="preferredRole"
                      name="preferredRole"
                      value={formData.preferredRole}
                      onChange={handleInputChange}
                    >
                      <option value="">Select preferred role</option>
                      <option value="Software Developer">Software Developer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Web Developer">Web Developer</option>
                      <option value="Mobile Developer">Mobile Developer</option>
                      <option value="UX/UI Designer">UX/UI Designer</option>
                      <option value="Business Analyst">Business Analyst</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="location">
                      <FaMapMarkerAlt className="input-icon" />
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Bangalore, Remote"
                    />
                  </div>
                </div>

                {/* Row 8: Experience & Job Type */}
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="experienceLevel">
                      <FaBriefcase className="input-icon" />
                      Experience Level
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  <div className="form-group half">
                    <label htmlFor="jobType">
                      <FaBriefcase className="input-icon" />
                      Job Type
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions two-buttons">
                  <button type="button" className="prev-btn" onClick={handlePreviousPage}>
                    <FaArrowLeft /> Back to Personal Info
                  </button>
                  <button type="submit" className="submit-btn">
                    Create Account
                  </button>
                </div>
              </div>
            )}

            <div  style={{paddingTop:20,textAlign:'center'}}>
              Already have an account? <a href="/signin">Sign In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;