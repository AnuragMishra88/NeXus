import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './Api/AuthContext'; 
import Header from './Component/Header/Header';
import Navbar from './Component/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import SignIn from './Pages/Homepage/Auth/SignIn';
import Register from './Pages/Homepage/Auth/Register';
import SmartNotes from './Component/Academic/SmartNotes'; 

import './App.css';

function App() {
  const { user, loading } = useAuth(); 
  const [activePage, setActivePage] = useState('home');
  const [selectedMode, setSelectedMode] = useState('Academic');

  // Sync mode based on URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.toLowerCase().includes('/career')) {
      setSelectedMode('Career');
      setActivePage('career-home');
    } else {
      setSelectedMode('Academic');
      setActivePage('academic-home');
    }
  }, []);

  // Teammate's loading logic to prevent white screen
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
            
            {/* Auth routes - Redirect if already logged in (Teammate's logic) */}
            <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn setActivePage={setActivePage} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register setActivePage={setActivePage} />} />
            
            {/* Academic feature routes (Your specific paths) */}
            <Route path="/smart-notes" element={<SmartNotes setActivePage={setActivePage} />} />
            <Route path="/assignment-helper" element={<div>Assignment Helper Page</div>} />
            <Route path="/exam-prep" element={<div>Exam Prep Buddy Page</div>} />
            <Route path="/doubt-solver" element={<div>Doubt Solver Page</div>} />
            <Route path="/study-scheduler" element={<div>Study Scheduler Page</div>} />
            <Route path="/progress-analytics" element={<div>Progress Analytics Page</div>} />
            
            {/* Career feature routes (Your specific paths) */}
            <Route path="/resume-analyzer" element={<div>Resume Analyzer Page</div>} />
            <Route path="/roadmap" element={<div>Career Roadmap Page</div>} />
            <Route path="/qa-assistant" element={<div>Q&A Assistant Page</div>} />
            <Route path="/interview-simulator" element={<div>Interview Simulator Page</div>} />
            <Route path="/coding-platforms" element={<div>Coding Platforms Page</div>} />
            <Route path="/portfolio-builder" element={<div>Portfolio Builder Page</div>} />
            
            {/* Common protected routes (Merged logic) */}
            <Route path="/profile" element={user ? <div>Profile Page</div> : <Navigate to="/signin" />} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/logout" element={<div>Logout Page</div>} />
            
            {/* Fallback route */}
            <Route path="*" element={<Homepage setActivePage={setActivePage} selectedMode={selectedMode} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;