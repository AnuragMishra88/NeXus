// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './Api/AuthContext'; 
import Header from './Component/Header/Header';
import Navbar from './Component/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import SignIn from './Pages/Homepage/Auth/SignIn';
import Register from './Pages/Homepage/Auth/Register';
import SmartNotes from './Component/Academic/SmartNotes'; 
import Profile from './Pages/Profile';
import ResumeAnalyzer from './Component/Career/ResumeAnalyzer';
import QuizBank from './Component/Academic/Quiz/QuizBank'; // FIXED: Correct path for Academic Quiz
import SkillAssessment from './Component/Career/Quiz/SkillAssessment';
// Import FAQ and About Us pages
import FAQ from './Pages/Homepage/Faq';
import AboutUs from './Pages/Homepage/Aboutus';

import './App.css';

function App() {
  const { user, loading } = useAuth(); 
  const [activePage, setActivePage] = useState('home');
  const [selectedMode, setSelectedMode] = useState('Academic');

  if (loading) {
    return (
      <div className="loading-container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
        <h2 style={{color: '#646cff'}}>Initializing NEXUS...</h2>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
        />
        <div className="content">
          <Routes>
            {/* Core Home Routes */}
            <Route path="/" element={<Homepage setActivePage={setActivePage} selectedMode={selectedMode} />} />
            <Route path="/Academic" element={<Homepage setActivePage={setActivePage} selectedMode="Academic" />} />
            <Route path="/Career" element={<Homepage setActivePage={setActivePage} selectedMode="Career" />} />
            
            {/* Auth routes */}
            <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn setActivePage={setActivePage} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register setActivePage={setActivePage} />} />
            
            {/* Profile route - Only accessible when logged in */}
            <Route path="/profile" element={user ? <Profile setActivePage={setActivePage} /> : <Navigate to="/signin" />} />
            
            {/* Academic feature routes */}
            <Route path="/smart-notes" element={<SmartNotes setActivePage={setActivePage} />} />
            <Route path="/assignment-helper" element={<div>Assignment Helper Page</div>} />
            <Route path="/exam-prep" element={<div>Exam Prep Buddy Page</div>} />
            <Route path="/doubt-solver" element={<div>Doubt Solver Page</div>} />
            <Route path="/study-scheduler" element={<div>Study Scheduler Page</div>} />
            <Route path="/progress-analytics" element={<div>Progress Analytics Page</div>} />
            <Route path="/quiz-bank" element={<QuizBank setActivePage={setActivePage} />} /> {/* FIXED: Now points to Academic Quiz */}
            
            {/* Career feature routes */}
            <Route path="/resume-analyzer" element={<ResumeAnalyzer setActivePage={setActivePage} />} />
            <Route path="/roadmap" element={<div>Career Roadmap Page</div>} />
            <Route path="/qa-assistant" element={<div>Q&A Assistant Page</div>} />
            <Route path="/interview-simulator" element={<div>Interview Simulator Page</div>} />
            <Route path="/coding-platforms" element={<div>Coding Platforms Page</div>} />
            <Route path="/portfolio-builder" element={<div>Portfolio Builder Page</div>} />
            <Route path="/skill-assessment" element={<SkillAssessment setActivePage={setActivePage} />}  />
            
            {/* FAQ and About Us routes */}
            <Route path="/faq" element={<FAQ setActivePage={setActivePage} />} />
            <Route path="/about" element={<AboutUs setActivePage={setActivePage} />} />
            
            {/* Common routes */}
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/logout" element={<div>Logout Page</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;