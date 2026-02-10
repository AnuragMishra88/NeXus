import './Register.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Api/AuthContext';

import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaUniversity,
  FaGraduationCap, FaFileAlt, FaCalendarAlt, FaArrowRight,
  FaArrowLeft, FaCheck, FaUpload, FaBook, FaPercentage,
  FaBriefcase, FaMapMarkerAlt, FaTimes
} from 'react-icons/fa';

const Register = ({ setActivePage }) => {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    // Page 1: Mandatory
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    linkedinProfile: '', // Optional
    
    // Page 2: All Optional
    collegeName: '',
    degree: '',
    specialization: '',
    graduationYear: '2026',
    currentSemester: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    backlogs: '0',
    resume: null,
    skills: [],
    currentSkill: '',
    preferredRole: '',
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // VALIDATION: Only checks Name, Email, Password, and Phone
  const validatePage1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Min. 8 characters';
    
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Must be 10 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validatePage1()) return;

    try {
      // 1. Create FormData instead of a standard object
      const formDataToSend = new FormData();
      
      // 2. Append all text fields
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("collegeName", formData.collegeName);
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("graduationYear", formData.graduationYear);
      formDataToSend.append("cgpa", formData.cgpa);
      formDataToSend.append("tenthPercentage", formData.tenthPercentage);
      formDataToSend.append("twelfthPercentage", formData.twelfthPercentage);
      formDataToSend.append("skills", formData.skills.join(","));
      
      // 3. Append the File (The key MUST be 'file' to match your middleware)
      if (formData.resume) {
        formDataToSend.append("file", formData.resume);
      }

      // 4. Send FormData to the register function
      await register(formDataToSend);
      
      setIsVisible(false);
      setTimeout(() => { navigate('/'); }, 300);
      
    } catch (error) {
      setSubmitError(error.message || 'Registration failed');
    }
};

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
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
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => { navigate(-1); }, 300);
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleCloseModal}>
      <div className={`modal-container ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Your NEXUS Account</h2>
          <button className="close-btn" onClick={handleCloseModal}><FaTimes /></button>
        </div>

        {(submitError || authError) && (
          <div className="error-banner">
            <FaTimes /> <span>{submitError || authError}</span>
          </div>
        )}

        <div className="register-card">
          <form onSubmit={handleSubmit}>
            {currentPage === 1 ? (
              <div className="form-page">
                {/* PAGE 1: MANDATORY FIELDS */}
                <div className="form-row">
                  <div className="form-group half">
                    <label><FaUser /> Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={errors.fullName ? 'error' : ''} />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>
                  <div className="form-group half">
                    <label><FaEnvelope /> Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'error' : ''} />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label><FaLock /> Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={errors.password ? 'error' : ''} />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <div className="form-group half">
                    <label><FaPhone /> Phone Number *</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={errors.phoneNumber ? 'error' : ''} />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label><FaBriefcase /> LinkedIn Profile</label>
                  <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleInputChange} placeholder="Optional" />
                </div>

                <div className="form-actions">
                  <button type="button" className="next-btn" onClick={() => validatePage1() && setCurrentPage(2)}>
                    Continue to Academic Details <FaArrowRight />
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-page">
                {/* PAGE 2: OPTIONAL FIELDS (No asterisks) */}
                <div className="form-row">
                  <div className="form-group half">
                    <label><FaUniversity /> College/University</label>
                    <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group half">
                    <label><FaGraduationCap /> Degree/Program</label>
                    <select name="degree" value={formData.degree} onChange={handleInputChange}>
                      <option value="">Select your degree</option>
                      <option value="B.Tech">B.Tech / B.E.</option>
                      <option value="MCA">MCA</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label><FaCalendarAlt /> Graduation Year</label>
                    <select name="graduationYear" value={formData.graduationYear} onChange={handleInputChange}>
                      {[2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="form-group half">
                    <label><FaPercentage /> Current CGPA</label>
                    <input type="number" name="cgpa" value={formData.cgpa} onChange={handleInputChange} step="0.1" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label><FaFileAlt /> 10th Percentage</label>
                    <input type="number" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleInputChange} />
                  </div>
                  <div className="form-group half">
                    <label><FaFileAlt /> 12th Percentage</label>
                    <input type="number" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label><FaUpload /> Upload Resume</label>
                  <input type="file" name="resume" onChange={handleInputChange} accept=".pdf,.doc" />
                </div>

                {/* Skills Tag Input */}
                <div className="form-group">
                  <label><FaBook /> Skills</label>
                  <div className="skills-input-container">
                    <input type="text" value={formData.currentSkill} onChange={(e) => setFormData({...formData, currentSkill: e.target.value})} placeholder="Press enter to add" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())} />
                    <button type="button" onClick={handleSkillAdd}>Add</button>
                  </div>
                  <div className="skills-tags">
                    {formData.skills.map(s => <span key={s} className="skill-tag">{s} <FaTimes onClick={() => handleSkillRemove(s)} /></span>)}
                  </div>
                </div>

                <div className="form-actions two-buttons">
                  <button type="button" className="prev-btn" onClick={() => setCurrentPage(1)}><FaArrowLeft /> Back</button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;