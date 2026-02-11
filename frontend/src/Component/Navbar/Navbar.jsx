import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaTasks,
  FaGraduationCap,
  FaQuestionCircle,
  FaCalendarAlt,
  FaChartLine,
  FaFileContract,
  FaRoad,
  FaComments,
  FaUserTie,
  FaLaptopCode,
  FaBriefcase,
  FaRobot,
  FaUsers,
  FaBookOpen,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaLightbulb,
  FaProjectDiagram,
  FaCertificate,
  FaBook,
  FaEdit,
  FaClipboardCheck,
  FaUserGraduate,
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from '../../Api/AuthContext';

import academic_logo from "../../assets/academic.png";
import career_logo from "../../assets/career.png";

const Navbar = ({
  activePage,
  setActivePage,
  isExpanded,
  setIsExpanded,
  userMode = "Academic",
}) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(userMode);
  const [isColumn2Hovered, setIsColumn2Hovered] = useState(false);
  const { user } = useAuth(); // Add this line

  // Mode configuration for Column 1
  const modes = [
    {
      id: "Academic",
      icon: (
        <img
          src={academic_logo}
          alt="Academic"
          className="mode-img"
          height={40}
          width={50}
        />
      ),
      label: "Academic",
      color: "#3b82f6",
    },
    {
      id: "Career",
      icon: (
        <img
          src={career_logo}
          alt="Academic"
          className="mode-img"
          height={40}
          width={50}
        />
      ),
      label: "Career",
      color: "#10b981",
    },
  ];

  // Navigation items for each mode (Column 2)
  const modeItems = {
    Academic: [
      {
        id: "smart-notes",
        icon: <FaFileAlt />,
        label: "Smart Notes Maker",
        path: "/smart-notes",
      },
      {
        id: "assignment-helper",
        icon: <FaTasks />,
        label: "Assignment Helper",
        path: "/assignment-helper",
      },
      {
        id: "exam-prep",
        icon: <FaGraduationCap />,
        label: "Exam Prep Buddy",
        path: "/exam-prep",
      },
      {
        id: "doubt-solver",
        icon: <FaQuestionCircle />,
        label: "Doubt Solver",
        path: "/doubt-solver",
      },
      {
        id: "study-scheduler",
        icon: <FaCalendarAlt />,
        label: "Study Scheduler",
        path: "/study-scheduler",
      },

      {
        id: "lecture-notes",
        icon: <FaBook />,
        label: "Lecture Notes",
        path: "/lecture-notes",
      },
      {
        id: "quiz-bank",
        icon: <FaEdit />,
        label: "Quiz Bank",
        path: "/quiz-bank",
      },
    ],
    Career: [
      {
        id: "resume-analyzer",
        icon: <FaFileContract />,
        label: "Resume Analyzer",
        path: "/resume-analyzer",
      },
      {
        id: "roadmap",
        icon: <FaRoad />,
        label: "Career Roadmap",
        path: "/roadmap",
      },
      {
        id: "qa-assistant",
        icon: <FaComments />,
        label: "Q&A Assistant",
        path: "/qa-assistant",
      },
      {
        id: "interview-simulator",
        icon: <FaUserTie />,
        label: "Interview Simulator",
        path: "/interview-simulator",
      },
      {
        id: "coding-platforms",
        icon: <FaLaptopCode />,
        label: "Coding Platforms",
        path: "/coding-platforms",
      },
      {
        id: "portfolio-builder",
        icon: <FaBriefcase />,
        label: "Portfolio Builder",
        path: "/portfolio-builder",
      },
      {
        id: "linkedin-optimizer",
        icon: <FaUsers />,
        label: "LinkedIn Optimizer",
        path: "/linkedin-optimizer",
      },
      {
        id: "mock-interviews",
        icon: <FaUserTie />,
        label: "Mock Interviews",
        path: "/mock-interviews",
      },
      {
        id: "skill-assessment",
        icon: <FaCertificate />,
        label: "Skill Assessment",
        path: "/skill-assessment",
      },
    ],
  };
  const goToProfile = () => {
    setActivePage("profile"); // This tells App.js to switch focus
    navigate("/profile");
  };

  // Common items for bottom section
  const commonItems = [
    { id: "settings", icon: <FaCog />, label: "Settings", path: "/settings" },
  ];

  const currentMode = modes.find((mode) => mode.id === selectedMode);
  const currentItems = modeItems[selectedMode];

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
    setActivePage(`${modeId}-home`);
    navigate(`/${modeId}`);
  };

  const handleNavigation = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  return (
    <div className="navbar-container">
      {/* Column 1 - Fixed with Mode Selection */}
      <div className="navbar-column-1">
        <div className="mode-selection">
          {modes.map((mode) => (
            <div key={mode.id} className="mode-wrapper">
              <button
                className={`mode-button ${selectedMode === mode.id ? "active" : ""}`}
                onClick={() => handleModeSelect(mode.id)}
                style={{ "--mode-color": mode.color }}
              >
                <span className="mode-icon">{mode.icon}</span>
              </button>

              <span className="mode-label">{mode.label}</span>
            </div>
          ))}
        </div>

        {/* Common Items at Bottom of Column 1 */}
        <div className="column-1-bottom">
          {commonItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => handleNavigation(item)}
            >
              <div className="nav-item-content">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            </button>
          ))}
          <button className="nav-item" onClick={() => navigate("/profile")}>
  <div className="nav-item-content">
    {user?.profilePhoto ? (
      <img 
        src={user.profilePhoto} 
        alt="Profile" 
        className="profile-photo-nav"
      />
    ) : (
      <span className="nav-icon">
        <FaUserCircle />
      </span>
    )}
    <span className="nav-label">Profile</span>
  </div>
</button>
        </div>
      </div>

      {/* Column 2 - Dynamic Navigation for Selected Mode */}
      {selectedMode && (
        <div
          className={`navbar-column-2 ${isColumn2Hovered ? "hovered" : ""}`}
          onMouseEnter={() => setIsColumn2Hovered(true)}
          onMouseLeave={() => setIsColumn2Hovered(false)}
        >
          {/* Column 2 Header */}
          <div className="column-2-header"></div>

          {/* Navigation Items - Show labels only on hover */}
          <div className="column-2-navigation">
            {currentItems.map((item) => (
              <button
                key={item.id}
                className={`column-2-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => handleNavigation(item)}
                title={item.label}
              >
                <span className="item-icon">{item.icon}</span>
                {isColumn2Hovered && (
                  <>
                    <span className="item-label">{item.label}</span>
                    {item.badge && (
                      <span className="item-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
