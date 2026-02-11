import React, { useState, useRef, useEffect } from 'react';
import './ResumeAnalyzer.css'; // ONLY THIS IMPORT - NO CSS CODE HERE!
import { authService } from '../../Api/authService';
import {
  FaFileAlt,
  FaUpload,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaChartLine,
  FaCheckCircle,
  FaExclamationCircle,
  FaCopy,
  FaMagic,
  FaStar,
  FaLightbulb,
  FaTools,
  FaUserTie
} from 'react-icons/fa';

const ResumeAnalyzer = ({ setActivePage }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [fileName, setFileName] = useState('');
  const [rewriteInput, setRewriteInput] = useState('');
  const [rewriteResult, setRewriteResult] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [currentPage, setCurrentPage] = useState(1);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSkillSuggestions(targetRole);
  }, [targetRole]);

  const fetchSkillSuggestions = async (role) => {
    try {
      console.log('🔍 Fetching skills for:', role);
      const data = await authService.getSkillSuggestions(role);
      setSkillSuggestions(data.suggested_skills || []);
    } catch (err) {
      console.error('❌ Failed to fetch skill suggestions:', err);
      setSkillSuggestions([
        'Python', 'JavaScript', 'React', 'Node.js', 
        'SQL', 'Git', 'Docker', 'AWS'
      ]);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📝 Analyzing resume text...');
      const data = await authService.analyzeResumeText(resumeText, jobDescription);
      setAnalysis(data);
      setCurrentPage(2);
    } catch (err) {
      setError(err.message || 'Analysis failed. Make sure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    setError('');
    setFileName(file.name);

    try {
      console.log('📄 Uploading file:', file.name);
      const data = await authService.analyzeResumeFile(file, jobDescription);
      setAnalysis(data.analysis || data);
      setCurrentPage(2);
    } catch (err) {
      setError(err.message || 'File analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!rewriteInput.trim()) {
      setError('Please enter a bullet point to rewrite');
      return;
    }

    setRewriteLoading(true);
    setError('');

    try {
      const data = await authService.rewriteBulletPoint(rewriteInput, targetRole);
      setRewriteResult(data.improved);
    } catch (err) {
      setError(err.message || 'Rewrite failed');
    } finally {
      setRewriteLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#2196F3';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  const handleCopyAnalysis = () => {
    if (!analysis) return;
    
    const text = `
RESUME ANALYSIS REPORT
=====================
Overall Score: ${analysis.overall_score}/100
Recommendation: ${analysis.hiring_recommendation || 'N/A'}

TECHNICAL SKILLS DETECTED:
${analysis.technical_skills_detected?.map(s => `• ${s}`).join('\n') || 'None detected'}

SOFT SKILLS DETECTED:
${analysis.soft_skills_detected?.map(s => `• ${s}`).join('\n') || 'None detected'}

STRENGTHS:
${analysis.strengths?.map(s => `• ${s}`).join('\n') || 'None listed'}

AREAS FOR IMPROVEMENT:
${analysis.improvements?.map(i => `• ${i}`).join('\n') || 'None listed'}
    `;
    
    navigator.clipboard.writeText(text);
    alert('Analysis copied to clipboard!');
  };

  const handleClear = () => {
    setResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setError('');
    setFileName('');
    setRewriteInput('');
    setRewriteResult('');
    setCurrentPage(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="resume-analyzer">
      <div className="analyzer-header">
        <h1><FaFileAlt /> AI Resume Analyzer</h1>
        <p>Get comprehensive feedback on your resume with AI-powered analysis</p>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationCircle /> {error}
          <button className="close-error" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="analyzer-content">
        {currentPage === 1 && (
          <div className="input-page">
            <div className="input-tabs">
              <button 
                className={`tab ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
              >
                📝 Paste Resume
              </button>
              <button 
                className={`tab ${activeTab === 'file' ? 'active' : ''}`}
                onClick={() => setActiveTab('file')}
              >
                📁 Upload PDF
              </button>
            </div>

            {activeTab === 'text' ? (
              <div className="input-group">
                <label>Resume Content *</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={12}
                />
              </div>
            ) : (
              <div className="file-upload">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  style={{ display: 'none' }}
                />
                <div 
                  className={`upload-area ${fileName ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {fileName ? (
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{fileName}</span>
                      <button 
                        className="remove-file"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileName('');
                          fileInputRef.current.value = '';
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaUpload className="upload-icon" />
                      <p>Click to upload or drag and drop</p>
                      <span className="upload-hint">PDF only • Max 10MB</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description for targeted analysis..."
                rows={6}
              />
            </div>

            <div className="action-buttons">
              <button 
                className="analyze-btn"
                onClick={analyzeResume}
                disabled={loading || (activeTab === 'text' && !resumeText.trim())}
              >
                {loading ? <><FaSpinner className="spin" /> Analyzing...</> : '🚀 Analyze Resume'}
              </button>
              <button 
                className="rewrite-nav-btn"
                onClick={() => setCurrentPage(3)}
              >
                <FaMagic /> Try Resume Rewriter
              </button>
            </div>
          </div>
        )}

        {currentPage === 2 && analysis && (
          <div className="results-page">
            <div className="score-card">
              <div className="score-header">
                <h3><FaChartLine /> Overall Score</h3>
                <div 
                  className="score-circle"
                  style={{
                    background: `conic-gradient(${getScoreColor(analysis.overall_score)} ${analysis.overall_score * 3.6}deg, #e9ecef 0deg)`
                  }}
                >
                  <span>{analysis.overall_score}</span>
                </div>
                <div className={`recommendation-badge ${analysis.hiring_recommendation?.toLowerCase().replace(' ', '-')}`}>
                  <FaUserTie /> {analysis.hiring_recommendation || 'N/A'}
                </div>
              </div>
              
              {analysis.skill_match_percentage > 0 && (
                <div className="match-section">
                  <div className="match-label">
                    <span>Job Match Score</span>
                    <strong>{analysis.skill_match_percentage}%</strong>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${analysis.skill_match_percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="skills-section">
              <div className="skills-grid">
                <div className="skills-card">
                  <h4><FaTools /> Technical Skills</h4>
                  <div className="skills-tags">
                    {analysis.technical_skills_detected?.length > 0 ? (
                      analysis.technical_skills_detected.map((skill, idx) => (
                        <span key={idx} className="skill-tag technical">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="no-skills">No technical skills detected</p>
                    )}
                  </div>
                </div>
                
                <div className="skills-card">
                  <h4><FaStar /> Soft Skills</h4>
                  <div className="skills-tags">
                    {analysis.soft_skills_detected?.length > 0 ? (
                      analysis.soft_skills_detected.map((skill, idx) => (
                        <span key={idx} className="skill-tag soft">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="no-skills">No soft skills detected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <div className="feedback-grid">
                <div className="strengths-card">
                  <h4><FaCheckCircle /> Strengths</h4>
                  <ul>
                    {analysis.strengths?.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="improvements-card">
                  <h4><FaExclamationCircle /> Areas for Improvement</h4>
                  <ul>
                    {analysis.improvements?.map((improvement, idx) => (
                      <li key={idx}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {analysis.missing_keywords?.length > 0 && (
              <div className="missing-keywords-section">
                <h4><FaLightbulb /> Keywords to Add</h4>
                <div className="skills-tags">
                  {analysis.missing_keywords.map((keyword, idx) => (
                    <span key={idx} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="results-actions">
              <button className="back-btn" onClick={() => setCurrentPage(1)}>
                <FaArrowLeft /> New Analysis
              </button>
              <button className="copy-btn" onClick={handleCopyAnalysis}>
                <FaCopy /> Copy Report
              </button>
              <button className="rewrite-btn" onClick={() => setCurrentPage(3)}>
                <FaMagic /> Rewrite Bullets
              </button>
              <button className="clear-btn" onClick={handleClear}>
                <FaTimes /> Clear
              </button>
            </div>
          </div>
        )}

        {currentPage === 3 && (
          <div className="rewrite-page">
            <h2><FaMagic /> Resume Bullet Point Rewriter</h2>
            
            <div className="input-group">
              <label>Target Role</label>
              <select 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <div className="input-group">
              <label>Original Bullet Point</label>
              <textarea
                value={rewriteInput}
                onChange={(e) => setRewriteInput(e.target.value)}
                placeholder="Paste a bullet point from your resume to improve it..."
                rows={4}
              />
            </div>

            <button 
              className="rewrite-action-btn"
              onClick={handleRewrite}
              disabled={rewriteLoading || !rewriteInput.trim()}
            >
              {rewriteLoading ? (
                <><FaSpinner className="spin" /> Rewriting...</>
              ) : (
                <><FaMagic /> Rewrite with AI</>
              )}
            </button>

            {rewriteResult && (
              <div className="rewrite-result">
                <h4>✨ Improved Version:</h4>
                <div className="result-box">
                  <p>{rewriteResult}</p>
                  <button 
                    className="copy-small"
                    onClick={() => {
                      navigator.clipboard.writeText(rewriteResult);
                      alert('Copied!');
                    }}
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}

            <div className="skill-suggestions">
              <h4>🎯 Recommended Skills for {targetRole}</h4>
              <div className="skills-tags">
                {skillSuggestions.map((skill, idx) => (
                  <span key={idx} className="suggestion-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="rewrite-nav">
              <button className="back-btn" onClick={() => setCurrentPage(analysis ? 2 : 1)}>
                <FaArrowLeft /> Back
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="page-indicator">
        <span 
          className={`dot ${currentPage === 1 ? 'active' : ''}`}
          onClick={() => setCurrentPage(1)}
        />
        {analysis && (
          <span 
            className={`dot ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => setCurrentPage(2)}
          />
        )}
        <span 
          className={`dot ${currentPage === 3 ? 'active' : ''}`}
          onClick={() => setCurrentPage(3)}
        />
      </div>
    </div>
  );
};

export default ResumeAnalyzer;